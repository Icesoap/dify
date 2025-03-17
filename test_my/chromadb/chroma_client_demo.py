# import chromadb
# # chroma_client = chromadb.HttpClient(host='localhost', port=8000)
# chroma_client = chromadb.PersistentClient(path='./mytest_chromadb')
#
# print(chroma_client)

import chromadb


# chroma_client = chromadb.Client(database='dify_test')
# chroma_client = chromadb.PersistentClient(path='./mytest_chromadb',settings=chromadb.config.Settings(allow_reset=True))
chroma_client = chromadb.PersistentClient(path='E:\\work-space\\demo-workspace\\github\\fork\\vanna-flask',settings=chromadb.config.Settings(allow_reset=True))
# chroma_client = chromadb.HttpClient(host='localhost', port=8001,settings=chromadb.config.Settings(allow_reset=True))
# chroma_client.delete_collection(name='my_collection')
chroma_client.reset()
exit(0)


# admin_client = chromadb.AdminClient()

# database = admin_client.get_database("default_database", "default_tenant")
# admin_client.create_database('dify_db_test')
# print(database)

version = chroma_client.get_version()
print(version)



# chroma_client.set_database('dify_db_test')
# chroma_client.set_tenant('dify_tenant_test')



# collection = chroma_client.create_collection(name="my_collection")

collection = chroma_client.get_collection(name="my_collection")
# count = collection.count()
# print(count)


# collection.add(
#     documents=["This is a document about engineer", "This is a document about steak"],
#     metadatas=[{"source": "doc1"}, {"source": "doc2"}],
#     ids=["id1", "id2"]
# )
#
# results = collection.query(
#     query_texts=["Which food is the best?"],
#     n_results=2
# )

# print(results)
