'use client'
import type { ProColumns, RequestData } from '@ant-design/pro-components'
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components'
// import { ProTable } from '@ant-design/pro-components'
// import ModalFormDemo from '@/app/[locale]/(main-layout)/list/pro-table/(components)/ModalForm'
import { useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'
import type { DataType } from 'csstype'
import ModalFormAddAppCategory from '@/app/components/app/app-category-manage-dialog/category-form/index'
import { deleteAppCategory, fetchAppCategoryListPage, updateAppCategory } from '@/service/app-category'
import type { AppCategoryResponse } from '@/models/app'

export type TableListItem = {
  id: string
  name: string
  create_at: Date
}

const getTableData = async (params: {
  pageSize?: number
  current?: number
}): Promise<RequestData<TableListItem>> => {
  // const res = await Apis.getTableList({
  //   results: 55,
  //   page: params.current,
  //   size: params.pageSize,
  // })
  // {code:200,msg:'成功',data:[]}
  const response = await fetchAppCategoryListPage({ url: '/app_category_list_page', page: params.current, limit: params.pageSize })
  // {page: 1, limit: 10, total: 3, has_more: false, data: Array(3)}
  const result_page = response.data

  const data_result = result_page.data
  // const data_result = [
  //   {
  //     id: '1',
  //     name: '测试分类',
  //     create_at: '2023-07-01 21:30:03',
  //   },
  //   {
  //     id: '2',
  //     name: '测试分类2',
  //     create_at: '2023-07-02 17:30:03',
  //   },
  //   {
  //     id: '3',
  //     name: '测试分类3',
  //     create_at: '2023-07-03 08:30:03',
  //
  //   },
  // ]
  return ({
    success: true,
    total: result_page.total || 0,
    data: data_result || [],
  })
}

export default function ProTaleDemo() {
  // const {
  //   data: { categories, allList },
  // } = useSWR(
  //   ['/explore/apps'],
  //   () =>
  //     fetchAppList().then(({ categories, recommended_apps }) => ({
  //       categories,
  //       allList: recommended_apps.sort((a, b) => a.position - b.position),
  //     })),
  //   {
  //     fallbackData: {
  //       categories: [],
  //       allList: [],
  //     },
  //   },
  // )

  // useEffect(() => {
  //   // debugger
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchAppCategoryListPage({ url: '/app_category_list_page', page: 1, limit: 10 })
  //       const data = response.data
  //       console.log(`我的输出----${response}`)
  //       console.log(data)
  //     }
  //     catch (e) {
  //       console.error('Fetch error:', e)
  //     }
  //   }
  //
  //   fetchData()
  // }, [])

  // 表格数据状态
  const [dataSource, setDataSource] = useState<DataType[]>([])
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 编辑弹窗状态
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false)
  // 当前编辑的数据
  const [currentRecord, setCurrentRecord] = useState<TableListItem | null>(null)

  // 打开编辑弹窗
  const handleEditModel = (record: TableListItem) => {
    // debugger
    setCurrentRecord({ ...record })
    setEditModalVisible(true)
  }

  // 删除数据
  const handleDelete = async (id: string, actionRef: any) => {
    setLoading(true)
    let response: { msg: string; code: number; data: any } = { code: 500, msg: '删除失败', data: null }
    try {
      // 实际项目中这里会是真实的API请求
      // await new Promise(resolve => setTimeout(resolve, 500))

      debugger
      response = await deleteAppCategory(id)

      console.log(response)
      if (response == null) {
        message.error('删除失败')
      }
      else if (response.code !== 200) {
        message.error(`删除失败,${response.msg}`)
      }
      else if (response.code === 200) {
        message.success('删除成功')
        actionRef.current?.reload()
      }
      // message.success('删除成功')
    }
    catch (error) {
      message.error(`删除时报错:${error}`)
      console.error(`删除时报错:${error}`)
    }
    finally {
      setLoading(false)
    }
  }

  // 关闭编辑弹窗
  const handleCancel = () => {
    setEditModalVisible(false)
    setCurrentRecord(null)
  }

  // 保存编辑的数据
  const handleEditSave = async (currentRecord: TableListItem, actionRef: any) => {
    // debugger
    console.log('保存编辑的数据：', currentRecord)
    if (!currentRecord)
      return

    setLoading(true)
    let response: AppCategoryResponse = null
    try {
      // // 实际项目中这里会是真实的API请求
      // await new Promise(resolve => setTimeout(resolve, 500))

      response = await updateAppCategory({
        id: currentRecord.id,
        categoryName: currentRecord.name,
      })

      // // 更新数据源
      // const newData = dataSource.map(item =>
      //   item.id === currentRecord.id ? currentRecord : item,
      // )
      // setDataSource(newData)
      console.log(response)
      if (response == null) {
        message.error('修改失败')
      }
      else if (response.code != 200) {
        message.error(`修改失败,${response.msg}`)
      }
      else if (response.code == 200) {
        message.success('修改成功')
        actionRef.current?.reload()
      }
      setEditModalVisible(false)
    }
    catch (error) {
      message.error(`修改失败,${response.msg}`)
      console.error(error)
    }
    finally {
      setLoading(false)
      setCurrentRecord(null)
    }
  }

  const actionRef = useRef()

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 400,
      dataIndex: ['id'],
    },
    {
      title: '分类名称',
      width: '35%',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      render: (text: any) => {
        // const formatter = new Intl.DateTimeFormat('zh-CN', {
        //   year: 'numeric',
        //   month: '2-digit',
        //   day: '2-digit',
        //   hour: '2-digit',
        //   minute: '2-digit',
        //   second: '2-digit',
        // })
        const date = new Date(text)
        return isNaN(date.getTime()) ? text : date.toLocaleString()
        // return isNaN(date.getTime()) ? text : `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        // return isNaN(date.getTime()) ? text : formatter.format(date)
      },
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TableListItem) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined/>}
            size="small"
            onClick={() => handleEditModel(record)}
            type="primary"
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要删除[${record.name}]这个应用分类吗?`}
            onConfirm={() => handleDelete(record.id,actionRef)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined/>}
              size="small"
              variant="solid"
              // type="primary"
              color='pink'
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },

  ]

  return (
    <>
      <ProTable<TableListItem>
        columns={columns}
        request={getTableData}
        actionRef={actionRef}
        rowKey="phone"
        pagination={{
          pageSize: 5,
          showQuickJumper: true,
        }}
        search={{
          optionRender: false,
          collapsed: false,
        }}
        dateFormatter="string"
        headerTitle="应用分类列表"
        toolBarRender={() => [
          // <Button key="show">查看日志</Button>,
          // <Button key="out">
          //   导出数据
          //   <DownOutlined/>
          // </Button>,
          <ModalFormAddAppCategory key="ModalFormAddAppCategory" actionRef={actionRef}/>,
        ]}
      />

      {/* 编辑弹窗 */}
      <ModalForm
        title={`编辑应用分类-${currentRecord?.name}`}
        open={editModalVisible}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            handleCancel()
          },
          //   footer: [
          //     <Button key="cancel" onClick={handleCancel}>
          // 取消
          //     </Button>,
          //     <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          // 保存
          //     </Button>,
          //   ],
        }}

        onFinish={
          async (values: TableListItem) => {
            const response = await handleEditSave(values, actionRef)
            return true
          }
        }
        // footer={[
        //   <Button key="cancel" onClick={handleCancel}>
        //                 取消
        //   </Button>,
        //   <Button key="save" type="primary" onClick={handleSave} loading={loading}>
        //                 保存
        //   </Button>,
        // ]}
        // destroyOnHidden={ true}
      >
        {currentRecord && (
          <div className="space-y-4 p-2">
            {/* 隐藏后用来传Id */}
            <ProFormText
              name="id"
              label="id"
              initialValue={currentRecord.id}
              hidden={true}
            />
            {/* <ProForm.Group> */}
            {/* 分类名称 */}
            <ProFormText
              name="name"
              label="分类名称"
              initialValue={currentRecord.name}
              // initialValue={'abc'}
              rules={[{ required: true, message: '请输分类名称' }]}
              // fieldProps={{
              //   onChange: (e) => {
              //     const value = e.target.value
              //     setCurrentRecord(prev => prev ? { ...prev, name: value } : null)
              //   },
              // }}
            />
            {/* </ProForm.Group> */}

          </div>
        )}
      </ModalForm>
    </>
  )
}
