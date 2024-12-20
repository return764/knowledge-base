import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fragment, useState } from 'react'
import ModelSettings from "../components/settings/ModelSettings.tsx";

const menuItems = [
  { name: '模型设置', component: () => <ModelSettings/> },
]

const Settings = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="container mx-auto py-6 px-1">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex} vertical>
        <div className="flex gap-1">
          {/* 左侧菜单 */}
          <TabList className="w-24 space-y-2">
            {menuItems.map((item) => (
              <Tab as={Fragment} key={item.name}>
                {({ selected }) => (
                  <button
                    className={`w-full rounded-lg py-1.5 px-4 text-left text-sm font-medium focus:outline-none ${
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
