import { PlusOutlined } from '@ant-design/icons'
// import { ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import { addAppCategory } from '@/service/app-category'

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export default function ModalFormAddAppCategory({ actionRef }: { actionRef: any }) {
  const [form] = Form.useForm<{ name: string; categoryName: string }>()
  return (
    <ModalForm<{
      name: string
      categoryName: string
    }>
      title="新建分类"
      trigger={
        <Button type="primary">
          <PlusOutlined/>
          新建分类
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      // submitTimeout={500}
      onFinish={async (values) => {
        // await waitTime(500)
        const response = await addAppCategory({
          categoryName: values.categoryName,
        })
        console.log(values.categoryName)
        console.log(response)
        message.success('提交成功')
        // 刷新表格
        actionRef.current?.reload()
        return true
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="lg"
          name="categoryName"
          label="分类名称"
          tooltip="最长为 200 位"
          placeholder="请输入分类名称"
          // initialValue={'123'}
          rules={[
            {
              required: true,
              message: '请输入分类名称',
            },
          ]}
          onChange
        />

      </ProForm.Group>

      {/* <ProForm.Group> */}
      {/*  <ProFormText */}
      {/*    width="md" */}
      {/*    name="contract" */}
      {/*    label="合同名称" */}
      {/*    placeholder="请输入名称" */}
      {/*  /> */}
      {/*  <ProFormDateRangePicker name="contractTime" label="合同生效时间" /> */}
      {/* </ProForm.Group> */}
      {/* <ProForm.Group> */}
      {/*  <ProFormSelect */}
      {/*    request={async () => [ */}
      {/*      { */}
      {/*        value: 'chapter', */}
      {/*        label: '盖章后生效', */}
      {/*      }, */}
      {/*    ]} */}
      {/*    width="xs" */}
      {/*    name="useMode" */}
      {/*    label="合同约定生效方式" */}
      {/*  /> */}
      {/*  <ProFormSelect */}
      {/*    width="xs" */}
      {/*    options={[ */}
      {/*      { */}
      {/*        value: 'time', */}
      {/*        label: '履行完终止', */}
      {/*      }, */}
      {/*    ]} */}
      {/*    name="unusedMode" */}
      {/*    label="合同约定失效效方式" */}
      {/*  /> */}
      {/* </ProForm.Group> */}
      {/* <ProFormText width="sm" name="id" label="主合同编号" /> */}
      {/* <ProFormText */}
      {/*  name="project" */}
      {/*  disabled */}
      {/*  label="项目名称" */}
      {/*  initialValue="xxxx项目" */}
      {/* /> */}
      {/* <ProFormText */}
      {/*  width="xs" */}
      {/*  name="mangerName" */}
      {/*  disabled */}
      {/*  label="商务经理" */}
      {/*  initialValue="启途" */}
      {/* /> */}
    </ModalForm>
  )
}
