import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useI18N } from '@/context/i18n'

export const useFormatTimeFromNow = () => {
    const { locale } = useI18N()
    // .fromNow() 自己修改的 这里原代码会报错,英雌去掉fromNow()
    const formatTimeFromNow = useCallback((time: number) => {
        return dayjs(time).locale(locale === 'zh-Hans' ? 'zh-cn' : locale)
        // return dayjs(time).locale(locale === 'zh-Hans' ? 'zh-cn' : locale).fromNow()
    }, [locale])

    return { formatTimeFromNow }
}
