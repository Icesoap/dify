'use client'
import { useEffect, useState } from 'react'
import Head from 'next/head'

// 这个页面没写完

const AppCategoryManager = () => {
  // 模拟初始分类数据
  const initialCategories = [
    { id: 1, name: '社交应用', description: '社交网络、聊天工具', appCount: 12, color: 'bg-blue-500/50' },
    { id: 2, name: '生产力工具', description: '办公、效率提升类应用', appCount: 8, color: 'bg-green-500/50' },
    { id: 3, name: '娱乐游戏', description: '游戏、影音娱乐应用', appCount: 15, color: 'bg-purple-500/50' },
    { id: 4, name: '教育学习', description: '在线课程、学习工具', appCount: 7, color: 'bg-yellow-500/50' },
    { id: 5, name: '健康健身', description: '健康管理、运动健身应用', appCount: 9, color: 'bg-red-500/50' },
    { id: 6, name: '旅行导航', description: '地图、旅行规划应用', appCount: 6, color: 'bg-indigo-500/50' },
  ]

  // 状态管理
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'bg-blue-500' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', color: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 初始化数据
  useEffect(() => {
    setCategories(initialCategories)
    setFilteredCategories(initialCategories)
  }, [])

  // 搜索功能
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCategories(categories)
    }
    else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
                || category.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCategories(filtered)
    }
  }, [searchTerm, categories])

  // 添加新分类
  const handleAddCategory = () => {
    if (newCategory.name.trim() === '')
      return

    const newCat = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      appCount: 0,
      color: newCategory.color,
    }

    setCategories([...categories, newCat])
    setNewCategory({ name: '', description: '', color: 'bg-blue-500' })
    setIsModalOpen(false)
  }

  // 开始编辑
  const startEditing = (category) => {
    setEditingId(category.id)
    setEditForm({
      name: category.name,
      description: category.description,
      color: category.color,
    })
  }

  // 保存编辑
  const saveEdit = () => {
    setCategories(categories.map(cat =>
      cat.id === editingId ? { ...cat, ...editForm } : cat,
    ))
    setEditingId(null)
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null)
  }

  // 删除分类
  const deleteCategory = (id) => {
    if (window.confirm('确定要删除这个分类吗？'))
      setCategories(categories.filter(cat => cat.id !== id))
  }

  // 颜色选择选项
  const colorOptions = [
    { value: 'bg-blue-500', label: '蓝色' },
    { value: 'bg-green-500', label: '绿色' },
    { value: 'bg-purple-500', label: '紫色' },
    { value: 'bg-yellow-500', label: '黄色' },
    { value: 'bg-red-500', label: '红色' },
    { value: 'bg-indigo-500', label: '靛蓝色' },
    { value: 'bg-pink-500', label: '粉色' },
    { value: 'bg-teal-500', label: '青绿色' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>应用分类管理</title>
        <meta name="description" content="应用分类管理系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 标题和操作区域 */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">应用分类管理</h1>
              <p className="text-gray-600 mt-2">管理您的应用分类，添加、编辑或删除分类</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                                添加新分类
              </button>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索分类..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <span className="text-gray-700 mr-2">排序:</span>
                <select className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>按名称</option>
                  <option>按应用数量</option>
                  <option>按创建时间</option>
                </select>
              </div>
            </div>
          </div>

          {/* 分类列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className={`${category.color} h-2 w-full`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {editingId === category.id
                          ? (
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          )
                          : (
                            category.name
                          )}
                      </h3>
                      <div className="mt-2 text-gray-600">
                        {editingId === category.id
                          ? (
                            <textarea
                              value={editForm.description}
                              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-full h-20"
                            />
                          )
                          : (
                            category.description
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                        {category.appCount} 个应用
                      </div>
                      {editingId === category.id && (
                        <div className="mt-2">
                          <select
                            value={editForm.color}
                            onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            {colorOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {editingId === category.id
                      ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                          >
                                                    保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
                          >
                                                    取消
                          </button>
                        </>
                      )
                      : (
                        <>
                          <button
                            onClick={() => startEditing(category)}
                            className="px-3 py-1.5 bg-blue-400 text-white rounded-lg text-sm hover:bg-blue-500 transition"
                          >
                                                    编辑
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="px-3 py-1.5 bg-red-400 text-white rounded-lg text-sm hover:bg-red-500 transition"
                          >
                                                    删除
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-700">没有找到匹配的分类</h3>
              <p className="mt-2 text-gray-500">尝试修改搜索条件或添加新分类</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                                添加新分类
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 添加分类模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">添加新分类</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如：社交应用"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类描述</label>
                  <textarea
                    value={newCategory.description}
                    onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="简单描述这个分类"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主题颜色</label>
                  <select
                    value={newCategory.color}
                    onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                                        取消
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                                        添加分类
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2023 应用分类管理系统 | 使用 Next.js 构建</p>
        </div>
      </footer>
    </div>
  )
}

export default AppCategoryManager
