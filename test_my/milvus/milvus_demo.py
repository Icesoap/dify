#from pymilvus import MilvusClient
from milvus import default_server


if __name__ == '__main__':

    # client = MilvusClient("../../my_db/milvus_demo.db")
    # print(client)
    # 启动 Milvus Lite，绑定到所有网络接口
    # with default_server:
    default_server.set_base_dir('./milvus_data')
    # 启动milvus服务器
    default_server.start()
        # default_server.start(host="0.0.0.0", port="19530")  # 默认端口为 19530

    print("Milvus Lite started.")


