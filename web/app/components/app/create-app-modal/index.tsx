'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'
import { useContext, useContextSelector } from 'use-context-selector'
import { RiArrowRightLine, RiCommandLine, RiCornerDownLeftLine, RiExchange2Fill } from '@remixicon/react'
import Link from 'next/link'
import { useDebounceFn, useKeyPress } from 'ahooks'
import Image from 'next/image'
import dayjs from 'dayjs'
import Select from 'react-select'
import AppIconPicker from '../../base/app-icon-picker'
import type { AppIconSelection } from '../../base/app-icon-picker'
import Button from '@/app/components/base/button'
import Divider from '@/app/components/base/divider'
import cn from '@/utils/classnames'
import AppsContext, { useAppContext } from '@/context/app-context'
import { useProviderContext } from '@/context/provider-context'
import { ToastContext } from '@/app/components/base/toast'
import type { AppMode } from '@/types/app'
// import {createApp} from '@/service/apps'
import { createApp, fetchAppCategoryList } from '@/service/apps'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import AppIcon from '@/app/components/base/app-icon'
import AppsFull from '@/app/components/billing/apps-full-in-dialog'
import { BubbleTextMod, ChatBot, ListSparkle, Logic } from '@/app/components/base/icons/src/vender/solid/communication'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { getRedirection } from '@/utils/app-redirection'
import FullScreenModal from '@/app/components/base/fullscreen-modal'
import type { PeriodParams } from '@/app/components/app/overview/appChart'

type CreateAppProps = {
  onSuccess: () => void
  onClose: () => void
  onCreateFromTemplate?: () => void
}

function CreateApp({ onClose, onSuccess, onCreateFromTemplate }: CreateAppProps) {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { notify } = useContext(ToastContext)
  const mutateApps = useContextSelector(AppsContext, state => state.mutateApps)

  const [appMode, setAppMode] = useState<AppMode>('chat')
  const [appIcon, setAppIcon] = useState<AppIconSelection>({ type: 'emoji', icon: '🤖', background: '#FFEAD5' })
  const [showAppIconPicker, setShowAppIconPicker] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)
  const { isCurrentWorkspaceEditor } = useAppContext()

  const isCreatingRef = useRef(false)

  // 应用分类的Select
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  // const [options, setOptions] = useState([])
  // const [selectedOption, setSelectedOption] = useState(null)
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null)
  const [isFetched, setIsFetched] = useState(false)

  const onCreate = useCallback(async () => {
    // console.log(`onclick-selected-option:${selectedOption}`)
    if (!appMode) {
      notify({ type: 'error', message: t('app.newApp.appTypeRequired') })
      return
    }
    if (!name.trim()) {
      notify({ type: 'error', message: t('app.newApp.nameNotEmpty') })
      return
    }
    if (isCreatingRef.current)
      return
    isCreatingRef.current = true
    try {
      const app = await createApp({
        name,
        description,
        icon_type: appIcon.type,
        icon: appIcon.type === 'emoji' ? appIcon.icon : appIcon.fileId,
        icon_background: appIcon.type === 'emoji' ? appIcon.background : undefined,
        mode: appMode,
        app_category_id: selectedOption?.value,
      })
      notify({ type: 'success', message: t('app.newApp.appCreated') })
      onSuccess()
      onClose()
      mutateApps()
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      getRedirection(isCurrentWorkspaceEditor, app, push)
    }
    catch (e) {
      notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
    isCreatingRef.current = false
  }, [name, notify, t, appMode, appIcon, description, onSuccess, onClose, mutateApps, push, isCurrentWorkspaceEditor])
  // useDebounceFn是防抖功能
  const { run: handleCreateApp } = useDebounceFn(onCreate, { wait: 300 })
  useKeyPress(['meta.enter', 'ctrl.enter'], () => {
    if (isAppsFull)
      return
    handleCreateApp()
  })

  // const onSelectChange = useCallback(async () => {
  //   try {
  //     const res = fetchAppCategoryList({ url: '/app_category' })
  //     console.log(res)
  //   }
  //   catch (e) {
  //     notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
  //   }
  // }, [notify, t])
  // console.log(onSelectChange)

  // const getToneIcon = (toneId: number) => {
  //   const className = 'mr-2 w-[14px] h-[14px]'
  //   const res = ({
  //     1: <Brush01 className={`${className} text-[#6938EF]`}/>,
  //     2: <Scales02 className={`${className} text-indigo-600`}/>,
  //     3: <Target04 className={`${className} text-[#107569]`}/>,
  //   })[toneId]
  //   return res
  // }

  // const options = TONE_LIST.slice(0, 3).map((tone) => {
  //   return {
  //     value: tone.id,
  //     text: (
  //       <div className='flex items-center h-full'>
  //         {getToneIcon(tone.id)}
  //         {t(`common.model.tone.${tone.name}`) as string}
  //       </div>
  //     ),
  //   }
  // })

  const queryDateFormat = 'YYYY-MM-DD HH:mm'
  const today = dayjs()
  const [period, setPeriod] = useState<PeriodParams>({
    name: t('appLog.filter.period.last7days'),
    query: { start: today.subtract(7, 'day').startOf('day').format(queryDateFormat), end: today.endOf('day').format(queryDateFormat) },
  })
  // const onSelect = (item: Item) => {
  //   if (item.value === -1) {
  //     setPeriod({ name: item.name, query: undefined })
  //   }
  //   else if (item.value === 0) {
  //     const startOfToday = today.startOf('day').format(queryDateFormat)
  //     const endOfToday = today.endOf('day').format(queryDateFormat)
  //     setPeriod({ name: item.name, query: { start: startOfToday, end: endOfToday } })
  //   }
  //   else {
  //     setPeriod({
  //       name: item.name,
  //       query: { start: today.subtract(item.value as number, 'day').startOf('day').format(queryDateFormat), end: today.endOf('day').format(queryDateFormat) },
  //     })
  //   }
  // }

  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' },
  // ]

  useEffect(() => {
    // 这个判断是为了防止重复,但是这里好像是  react 18的新特新,在dev模式下 会自动调用两遍
    if (!isFetched) {
      console.log('in effect')
      const fetchData = async () => {
        try {
          const response = await fetchAppCategoryList({ url: '/app_category' })
          const data = response.data

          // 转换数据为 react-select 需要的格式
          const formattedOptions = data.map(item => ({
            value: item.id, // 数据库中的ID字段
            label: item.name, // 数据库中显示文本的字段
          }))

          setOptions(formattedOptions)
          console.log(formattedOptions[0])

          // 数据加载后设置默认值 这里没起作用
          setSelectedOption(
            {
              value: formattedOptions[0].value,
              label: formattedOptions[0].label,
            },
          )
        }
        catch (error) {
          console.error('Fetch error:', error)
        }
        setIsFetched(true)
      }

      fetchData()
      console.log(`selected--${selectedOption}`)
    }
  }, [isFetched])

  // debugger;
  // console.log(`select output:${options[0]}`)

  return <>
    <div className='flex justify-center h-full overflow-y-auto overflow-x-hidden'>
      <div className='flex-1 shrink-0 flex justify-end'>
        <div className='px-10'>
          <div className='w-full h-6 2xl:h-[139px]'/>
          <div className='pt-1 pb-6'>
            <span className='title-2xl-semi-bold text-text-primary'>{t('app.newApp.startFromBlank')}</span>
          </div>
          <div className='leading-6 mb-2'>
            <span className='system-sm-semibold text-text-secondary'>{t('app.newApp.chooseAppType')}</span>
          </div>
          {/* <div className='flex flex-col w-[660px] gap-4'> */}
          <div className='flex flex-col w-[660px] gap-2'>
            <div>
              <div className='mb-2'>
                <span className='system-2xs-medium-uppercase text-text-tertiary'>{t('app.newApp.forBeginners')}</span>
              </div>
              <div className='flex flex-row gap-2'>
                <AppTypeCard
                  active={appMode === 'chat'}
                  title={t('app.types.chatbot')}
                  description={t('app.newApp.chatbotShortDescription')}
                  icon={<div className='w-6 h-6 bg-components-icon-bg-blue-solid rounded-md flex items-center justify-center'>
                    <ChatBot className='w-4 h-4 text-components-avatar-shape-fill-stop-100'/>
                  </div>}
                  onClick={() => {
                    setAppMode('chat')
                  }}/>
                <AppTypeCard
                  active={appMode === 'agent-chat'}
                  title={t('app.types.agent')}
                  description={t('app.newApp.agentShortDescription')}
                  icon={<div className='w-6 h-6 bg-components-icon-bg-violet-solid rounded-md flex items-center justify-center'>
                    <Logic className='w-4 h-4 text-components-avatar-shape-fill-stop-100'/>
                  </div>}
                  onClick={() => {
                    setAppMode('agent-chat')
                  }}/>
                <AppTypeCard
                  active={appMode === 'completion'}
                  title={t('app.newApp.completeApp')}
                  description={t('app.newApp.completionShortDescription')}
                  icon={<div className='w-6 h-6 bg-components-icon-bg-teal-solid rounded-md flex items-center justify-center'>
                    <ListSparkle className='w-4 h-4 text-components-avatar-shape-fill-stop-100'/>
                  </div>}
                  onClick={() => {
                    setAppMode('completion')
                  }}/>
              </div>
            </div>
            <div>
              <div className='mb-2'>
                <span className='system-2xs-medium-uppercase text-text-tertiary'>{t('app.newApp.forAdvanced')}</span>
              </div>
              <div className='flex flex-row gap-2'>
                <AppTypeCard
                  beta
                  active={appMode === 'advanced-chat'}
                  title={t('app.types.advanced')}
                  description={t('app.newApp.advancedShortDescription')}
                  icon={<div className='w-6 h-6 bg-components-icon-bg-blue-light-solid rounded-md flex items-center justify-center'>
                    <BubbleTextMod className='w-4 h-4 text-components-avatar-shape-fill-stop-100'/>
                  </div>}
                  onClick={() => {
                    setAppMode('advanced-chat')
                  }}/>
                <AppTypeCard
                  beta
                  active={appMode === 'workflow'}
                  title={t('app.types.workflow')}
                  description={t('app.newApp.workflowShortDescription')}
                  icon={<div className='w-6 h-6 bg-components-icon-bg-indigo-solid rounded-md flex items-center justify-center'>
                    <RiExchange2Fill className='w-4 h-4 text-components-avatar-shape-fill-stop-100'/>
                  </div>}
                  onClick={() => {
                    setAppMode('workflow')
                  }}/>
              </div>
            </div>
            <Divider style={{ margin: 0 }}/>
            {/* 自己添加的代码-下拉菜单-应用分类 */}
            <div className='flex space-x-3 items-center'>
              <div className='flex-1'>
                <div className='h-6 flex items-center mb-1'>
                  <label className='system-sm-semibold text-text-secondary'>{t('app.newApp.category')}</label>
                </div>
                {/* <Dropdown */}
                {/*  items={options} */}
                {/*  onSelect={item => console.log(item.value)} */}
                {/*  popupClassName='z-[1003]' */}
                {/* /> */}

                {/* <SimpleSelect */}
                {/*  items={Object.entries(TIME_PERIOD_MAPPING).map(([k, v]) => ({value: k, name: t(`appLog.filter.period.${v.name}`)}))} */}
                {/*  className='mt-0 !w-40' */}
                {/*  onSelect={(item) => { */}
                {/*    const id = item.value */}
                {/*    const value = TIME_PERIOD_MAPPING[id]?.value || '-1' */}
                {/*    const name = item.name || t('appLog.filter.period.allTime') */}
                {/*    onSelect({value, name}) */}
                {/*  }} */}
                {/*  defaultValue={'2'} */}
                {/* /> */}
                {/* <div>{selectedOption?.value}</div> */}
                <Select
                  // defaultValue={selectedOption}
                  // 设置默认值
                  // defaultValue={options[0]}
                  // value={selectedOption}
                  // style={{ height: '5px' }}
                  // class="h-1/2"
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  options={options}
                  placeholder={t('app.newApp.selectPlaceholderAppCategory')}
                />
              </div>
            </div>
            {/* 自己添加的注释-创建应用的modal页面 */}
            <div className='flex space-x-3 items-center'>
              <div className='flex-1'>
                <div className='h-6 flex items-center mb-1'>
                  <label className='system-sm-semibold text-text-secondary'>{t('app.newApp.captionName')}</label>
                </div>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('app.newApp.appNamePlaceholder') || ''}
                />
              </div>
              <AppIcon
                iconType={appIcon.type}
                icon={appIcon.type === 'emoji' ? appIcon.icon : appIcon.fileId}
                background={appIcon.type === 'emoji' ? appIcon.background : undefined}
                imageUrl={appIcon.type === 'image' ? appIcon.url : undefined}
                size='xxl' className='cursor-pointer rounded-2xl'
                onClick={() => {
                  setShowAppIconPicker(true)
                }}
              />
              {showAppIconPicker && <AppIconPicker
                onSelect={(payload) => {
                  setAppIcon(payload)
                  setShowAppIconPicker(false)
                }}
                onClose={() => {
                  setShowAppIconPicker(false)
                }}
              />}
            </div>
            <div>
              <div className='h-6 flex items-center mb-1'>
                <label className='system-sm-semibold text-text-secondary'>{t('app.newApp.captionDescription')}</label>
                <span className='system-xs-regular text-text-tertiary ml-1'>({t('app.newApp.optional')})</span>
              </div>
              <Textarea
                className='resize-none'
                placeholder={t('app.newApp.appDescriptionPlaceholder') || ''}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className='pt-5 pb-10 flex justify-between items-center'>
            <div className='flex gap-1 items-center system-xs-regular text-text-tertiary cursor-pointer' onClick={onCreateFromTemplate}>
              <span>{t('app.newApp.noIdeaTip')}</span>
              <div className='p-[1px]'>
                <RiArrowRightLine className='w-3.5 h-3.5'/>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button onClick={onClose}>{t('app.newApp.Cancel')}</Button>
              <Button disabled={isAppsFull || !name || !selectedOption?.value} className='gap-1' variant="primary" onClick={handleCreateApp}>
                <span>{t('app.newApp.Create')}</span>
                <div className='flex gap-0.5'>
                  <RiCommandLine size={14} className='p-0.5 system-kbd bg-components-kbd-bg-white rounded-sm'/>
                  <RiCornerDownLeftLine size={14} className='p-0.5 system-kbd bg-components-kbd-bg-white rounded-sm'/>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 shrink h-full flex justify-start relative overflow-hidden'>
        <div className='h-6 2xl:h-[139px] absolute left-0 top-0 right-0 border-b border-b-divider-subtle'></div>
        <div className='max-w-[760px] border-x border-x-divider-subtle'>
          <div className='h-6 2xl:h-[139px]'/>
          <AppPreview mode={appMode}/>
          <div className='absolute left-0 right-0 border-b border-b-divider-subtle'></div>
          <div className='w-[664px] h-[448px] flex items-center justify-center'
            style={{ background: 'repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(16,24,40,0.04) 4px,transparent 3px, transparent 6px)' }}>
            <AppScreenShot show={appMode === 'chat'} mode='chat'/>
            <AppScreenShot show={appMode === 'advanced-chat'} mode='advanced-chat'/>
            <AppScreenShot show={appMode === 'agent-chat'} mode='agent-chat'/>
            <AppScreenShot show={appMode === 'completion'} mode='completion'/>
            <AppScreenShot show={appMode === 'workflow'} mode='workflow'/>
          </div>
          <div className='absolute left-0 right-0 border-b border-b-divider-subtle'></div>
        </div>
      </div>
    </div>
    {
      isAppsFull && (
        <div className='px-8 py-2'>
          <AppsFull loc='app-create'/>
        </div>
      )
    }
  </>
}

type CreateAppDialogProps = CreateAppProps & {
  show: boolean
}
const CreateAppModal = ({ show, onClose, onSuccess, onCreateFromTemplate }: CreateAppDialogProps) => {
  return (
    <FullScreenModal
      overflowVisible
      closable
      open={show}
      onClose={onClose}
    >
      <CreateApp onClose={onClose} onSuccess={onSuccess} onCreateFromTemplate={onCreateFromTemplate}/>
    </FullScreenModal>
  )
}

export default CreateAppModal

type AppTypeCardProps = {
  icon: JSX.Element
  beta?: boolean
  title: string
  description: string
  active: boolean
  onClick: () => void
}

function AppTypeCard({ icon, title, beta = false, description, active, onClick }: AppTypeCardProps) {
  const { t } = useTranslation()
  return <div
    className={
      cn(`w-[191px] h-[84px] p-3 border-[0.5px] relative box-content
      rounded-xl border-components-option-card-option-border
      bg-components-panel-on-panel-item-bg shadow-xs cursor-pointer hover:shadow-md`, active
        ? 'outline outline-[1.5px] outline-components-option-card-option-selected-border shadow-md'
        : '')
    }
    onClick={onClick}
  >
    {beta && <div className='px-[5px] py-[3px]
      rounded-[5px] min-w-[18px] absolute top-3 right-3
      border border-divider-deep system-2xs-medium-uppercase text-text-tertiary'>{t('common.menus.status')}</div>}
    {icon}
    <div className='system-sm-semibold text-text-secondary mt-2 mb-0.5'>{title}</div>
    <div className='system-xs-regular text-text-tertiary'>{description}</div>
  </div>
}

function AppPreview({ mode }: { mode: AppMode }) {
  const { t } = useTranslation()
  const modeToPreviewInfoMap = {
    'chat': {
      title: t('app.types.chatbot'),
      description: t('app.newApp.chatbotUserDescription'),
      link: 'https://docs.dify.ai/guides/application-orchestrate/conversation-application?fallback=true',
    },
    'advanced-chat': {
      title: t('app.types.advanced'),
      description: t('app.newApp.advancedUserDescription'),
      link: 'https://docs.dify.ai/guides/workflow',
    },
    'agent-chat': {
      title: t('app.types.agent'),
      description: t('app.newApp.agentUserDescription'),
      link: 'https://docs.dify.ai/guides/application-orchestrate/agent',
    },
    'completion': {
      title: t('app.newApp.completeApp'),
      description: t('app.newApp.completionUserDescription'),
      link: null,
    },
    'workflow': {
      title: t('app.types.workflow'),
      description: t('app.newApp.workflowUserDescription'),
      link: 'https://docs.dify.ai/guides/workflow',
    },
  }
  const previewInfo = modeToPreviewInfoMap[mode]
  return <div className='px-8 py-4'>
    <h4 className='system-sm-semibold-uppercase text-text-secondary'>{previewInfo.title}</h4>
    <div className='mt-1 system-xs-regular text-text-tertiary max-w-96 min-h-8'>
      <span>{previewInfo.description}</span>
      {previewInfo.link && <Link target='_blank' href={previewInfo.link} className='text-text-accent ml-1'>{t('app.newApp.learnMore')}</Link>}
    </div>
  </div>
}

function AppScreenShot({ mode, show }: { mode: AppMode; show: boolean }) {
  const theme = useContextSelector(AppsContext, state => state.theme)
  const modeToImageMap = {
    'chat': 'Chatbot',
    'advanced-chat': 'Chatflow',
    'agent-chat': 'Agent',
    'completion': 'TextGenerator',
    'workflow': 'Workflow',
  }
  return <picture>
    <source media="(resolution: 1x)" srcSet={`/screenshots/${theme}/${modeToImageMap[mode]}.png`}/>
    <source media="(resolution: 2x)" srcSet={`/screenshots/${theme}/${modeToImageMap[mode]}@2x.png`}/>
    <source media="(resolution: 3x)" srcSet={`/screenshots/${theme}/${modeToImageMap[mode]}@3x.png`}/>
    <Image className={show ? '' : 'hidden'}
      src={`/screenshots/${theme}/${modeToImageMap[mode]}.png`}
      alt='App Screen Shot'
      width={664} height={448}/>
  </picture>
}
