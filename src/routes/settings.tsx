import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fragment } from 'react'

const menuItems = [
  { name: '个人信息', component: () => <div>个人信息设置</div> },
  { name: '账号安全', component: () => <div>账号安全设置</div> },
  { name: '通知设置', component: () => <div>通知设置内容</div> },
]

const Settings = () => {
  return (
    <div className="container mx-auto py-6">
      <TabGroup vertical>
        <div className="flex gap-2">
          {/* 左侧菜单 */}
          <TabList className="w-48 space-y-2">
            {menuItems.map((item) => (
              <Tab as={Fragment} key={item.name}>
                {({ selected }) => (
                  <button
                    className={`w-full rounded-lg py-2.5 px-4 text-left text-sm font-medium focus:outline-none ${
                      selected
                        ? 'bg-primary-active text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </Tab>
            ))}
          </TabList>

          {/* 右侧内容区域 */}
          <TabPanels className="flex-1">
            {menuItems.map((item) => (
              <TabPanel
                key={item.name}
                className="rounded-lg bg-white p-6 shadow"
              >
                <item.component />
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </TabGroup>
    </div>
  )
}

export default Settings
