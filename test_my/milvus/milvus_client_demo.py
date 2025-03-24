from pymilvus import connections, utility

if __name__ == '__main__':

    # 现在，你可以通过localhost和给定的端口连接
    # 端口由default_server.listen_port定义
    connect = connections.connect(host='127.0.0.1', port=19530)
    print(connect)

    # 检查服务器是否就绪。
    print(utility.get_server_version())
    print("执行完成")
