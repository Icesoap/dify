"""

docker exec <container_id> -it /bin/bash

sed -i 's/authorizationEnabled: false/authorizationEnabled: true/' milvus.yaml

"""

from pymilvus import connections, utility
connections.connect(
    alias='default',
    host='123.249.7.176',
    port='19530',
    user='root',
    password='Milvus',
)
utility.reset_password('root', 'Milvus', 'sensnow!@#$%^', using='default')
