from fastapi import FastAPI
from haystack.document_stores import ElasticsearchDocumentStore
#from haystack.retriever.dense import DensePassageRetriever
from haystack.retriever.sparse import ElasticsearchRetriever
from haystack.reader.farm import FARMReader
from haystack.pipeline import ExtractiveQAPipeline

cafile = '/Users/willmatthews/dev/elasticsearch-8.3.1/config/certs/http_ca.crt'

doc_store = ElasticsearchDocumentStore(
    host='localhost',
    username='elastic', password='w321F*FtvpU-1p+gEXVo',
    index='melkor',
    scheme='https', verify_certs=True, ca_certs=cafile
)

retriever = ElasticsearchRetriever(
    document_store=doc_store
)

reader = FARMReader(
    model_name_or_path="deepset/roberta-base-squad2"
)

pipeline = ExtractiveQAPipeline(reader=reader, retriever=retriever)

app = FastAPI()

@app.get('/query')
async def query():
    return pipeline.run(query='What benefits are there?')