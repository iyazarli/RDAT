const { validateTournament, reconcile } = require('./tournament-engine');
const PREFIX = 'tournaments/current/';
const fail = (status,message) => Object.assign(new Error(message),{status});
function createTournamentRepository(blob) {
  const pathname = id => { if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw fail(400,'Geçersiz turnuva kimliği.'); return `${PREFIX}${id}.json`; };
  async function read(id) {
    try {
      const response = await blob.get(pathname(id),{access:'private',useCache:false});
      if (!response || response.statusCode === 404) return null;
      if (response.statusCode !== 200 || !response.stream || !response.etag) throw fail(503,'Turnuva kaydı okunamadı.');
      return { value:await new Response(response.stream).json(),etag:response.etag };
    } catch(e) { if(e.name==='BlobNotFoundError')return null;throw e; }
  }
  return {
    async list() {
      let cursor;const rows=[];
      do {
        const page=await blob.list({prefix:PREFIX,limit:100,cursor});
        for(const b of page.blobs) {
          const id=b.pathname.slice(PREFIX.length,-5);const current=await read(id);
          if(current)rows.push({id,name:current.value.name,revision:current.value.revision,updated:current.value.updatedAt});
        }
        cursor=page.hasMore?page.cursor:undefined;
      } while(cursor);
      return rows.sort((a,b)=>String(b.updated).localeCompare(String(a.updated)));
    },
    async get(id) { const current=await read(id);if(!current)throw fail(404,'Turnuva bulunamadı.');return current.value; },
    async save(id,input) {
      pathname(id);
      try { validateTournament(input); } catch(e) { throw fail(400,e.message); }
      if(id!==input.id)throw fail(400,'Turnuva kimliği uyuşmuyor.');
      const current=await read(id);
      if((current?.value.revision??0)!==input.revision)throw fail(409,'Turnuva başka bir sekmede değişti. Taslağı dışa aktarın ve güncel kaydı açın.');
      const next=reconcile(input).tournament;next.revision=(current?.value.revision??0)+1;next.updatedAt=new Date().toISOString();
      // Eski sürüm ayrı özel Blob olarak korunur; site içeriği deposuna yazılmaz.
      if(current)await blob.put(`tournaments/history/${id}/${current.value.revision}.json`,JSON.stringify(current.value),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});
      try {
        await blob.put(pathname(id),JSON.stringify(next),{access:'private',addRandomSuffix:false,allowOverwrite:!!current,...(current?{ifMatch:current.etag}:{}),contentType:'application/json'});
      } catch(e) {
        if(e.name==='BlobPreconditionFailedError'||/already exists/i.test(e.message))throw fail(409,'Eşzamanlı kayıt değişikliği algılandı. Güncel turnuvayı açın.');
        throw e;
      }
      return next;
    },
  };
}
module.exports={createTournamentRepository};
