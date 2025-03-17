# import weaviate
# import json
#
# client = weaviate.Client(
#     embedded_options=weaviate.embedded.EmbeddedOptions(),
# )
# # END TestExample
#
# uuid = client.data_object.create({
#     'hello': 'World!'
# }, 'MyClass')
#
# obj = client.data_object.get_by_id(uuid, class_name='MyClass')
#
# print(json.dumps(obj, indent=2))

#不支持windows embedded方式安装
# import weaviate
# import os
#
# client = weaviate.connect_to_embedded(
#     version="4.10.4",  # e.g. version="1.26.5"
#     headers={
#         "X-OpenAI-Api-Key": os.getenv("OPENAI_APIKEY")  # Replace with your API key
#     },
#     persistence_data_path="weaviate_data"
# )

# Add your client code here.

# pip install weaviate
# pip install weaviate-client

import weaviate

client = weaviate.connect_to_local(
    host="192.168.110.97",  # Use a string to specify the host
    port=7946,
    # grpc_port=50051,
)

print(client.is_ready())