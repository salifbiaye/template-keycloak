"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  RiApps2Line,
  RiFlashlightFill,
  RiPlayLine,
  RiUserSettingsLine,
  RiSettings3Line,
  RiDashboardLine,
  RiDatabase2Line,
  RiCloudLine,
  RiShieldCheckLine,
  RiLockLine,
  RiKeyLine,
  RiUserLine,
  RiTeamLine,
  RiFileTextLine,
  RiBarChartLine,
  RiPieChartLine,
  RiLineChartLine,
  RiMailLine,
  RiNotificationLine,
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiGlobalLine,
  RiSearchLine,
  RiFilterLine,
  RiSortLine,
  RiRefreshLine,
  RiDownloadLine,
  RiUploadLine,
  RiShareLine,
  RiPrintLine,
  RiCameraLine,
  RiImageLine,
  RiVideoLine,
  RiMusicLine,
  RiFolderLine,
  RiFileLine,
  RiArchiveLine,
  RiInboxLine,
  RiSendPlaneLine,
  RiReplyLine,
  RiForwardLine,
  RiEditLine,
  RiDeleteBinLine,
  RiAddLine,
  RiSubtractLine,
  RiCloseLine,
  RiCheckLine,
  RiStarLine,
  RiHeartLine,
  RiThumbUpLine,
  RiBookmarkLine,
  RiFlagLine,
  RiEyeLine,
  RiEyeOffLine,
  RiVolumeUpLine,
  RiVolumeDownLine,
  RiVolumeMuteLine,
  RiPhoneLine,
  RiSmartphoneLine,
  RiComputerLine,
  RiTvLine,
  RiGamepadLine,
  RiHeadphoneLine,
  RiMicLine,
  RiWifiLine,
  RiBluetoothLine,
  RiBatteryLine,
  RiFlashlightLine,
  RiSunLine,
  RiMoonLine,
  RiThunderstormsLine,
  RiRainyLine,
  RiSnowyLine,
  RiWindyLine,
  RiFireLine,
  RiLeafLine,
  RiSeedlingLine,
  RiTreeLine,
  RiFlowerLine,
  RiBugLine,
  RiAntLine,
  RiFishLine,
  RiBirdLine,
  RiCatLine,
  RiDogLine,
  RiCarLine,
  RiBusLine,
  RiTruckLine,
  RiPlaneLine,
  RiRocketLine,
  RiShipLine,
  RiBikeLine,
  RiWalkLine,
  RiRunLine,
  RiFootballLine,
  RiBasketballLine,
  RiTennisLine,
  RiPingPongLine,
  RiBoxingLine,
  RiMedal2Line,
  RiTrophyLine,
  RiAwardLine,
  RiGiftLine,
  RiCupLine,
  RiRestaurantLine,
  RiHammerLine,
  RiToolsLine,
  RiScissorsLine,
  RiRulerLine,
  RiCompassLine,
  RiCalculatorLine,
  RiMicroscopeLine,
  RiFlaskLine,
  RiTestTubeLine,
  RiCapsuleLine,
  RiStethoscopeLine,
  RiFirstAidKitLine,
  RiHospitalLine,
  RiAmbulanceLine,
  RiPulseLine,
  RiMentalHealthLine,
  RiShoppingCartLine,
  RiShoppingBagLine,
  RiStore2Line,
  RiBankLine,
  RiMoneyDollarCircleLine,
  RiCoinLine,
  RiCreditCardLine,
  RiWalletLine,
  RiSafeLine,
  RiScales2Line,
  RiGavelLine,
  RiGovernmentLine,
  RiPoliceCarLine,
  RiFireTruckLine,
  RiSchoolLine,
  RiBookLine,
  RiGraduationCapLine,
  RiPencilLine,
  RiPaintBrushLine,
  RiPaletteLine,
  RiArtboardLine,
  RiDraftLine,
  RiLayoutLine,
  RiGridLine,
  RiTableLine,
  RiSidebarLine,
  RiMenuLine,
  RiMore2Line,
  RiLoader4Line
} from "@remixicon/react"

const iconList = [
  { name: "RiApps2Line", icon: RiApps2Line, category: "Interface" },
  { name: "RiFlashlightFill", icon: RiFlashlightFill, category: "Interface" },
  { name: "RiPlayLine", icon: RiPlayLine, category: "Media" },
  { name: "RiUserSettingsLine", icon: RiUserSettingsLine, category: "User" },
  { name: "RiSettings3Line", icon: RiSettings3Line, category: "Interface" },
  { name: "RiDashboardLine", icon: RiDashboardLine, category: "Interface" },
  { name: "RiDatabase2Line", icon: RiDatabase2Line, category: "Data" },
  { name: "RiCloudLine", icon: RiCloudLine, category: "Weather" },
  { name: "RiShieldCheckLine", icon: RiShieldCheckLine, category: "Security" },
  { name: "RiLockLine", icon: RiLockLine, category: "Security" },
  { name: "RiKeyLine", icon: RiKeyLine, category: "Security" },
  { name: "RiUserLine", icon: RiUserLine, category: "User" },
  { name: "RiTeamLine", icon: RiTeamLine, category: "User" },
  { name: "RiFileTextLine", icon: RiFileTextLine, category: "Files" },
  { name: "RiBarChartLine", icon: RiBarChartLine, category: "Charts" },
  { name: "RiPieChartLine", icon: RiPieChartLine, category: "Charts" },
  { name: "RiLineChartLine", icon: RiLineChartLine, category: "Charts" },
  { name: "RiMailLine", icon: RiMailLine, category: "Communication" },
  { name: "RiNotificationLine", icon: RiNotificationLine, category: "Communication" },
  { name: "RiCalendarLine", icon: RiCalendarLine, category: "Time" },
  { name: "RiTimeLine", icon: RiTimeLine, category: "Time" },
  { name: "RiMapPinLine", icon: RiMapPinLine, category: "Location" },
  { name: "RiGlobalLine", icon: RiGlobalLine, category: "Location" },
  { name: "RiSearchLine", icon: RiSearchLine, category: "Interface" },
  { name: "RiFilterLine", icon: RiFilterLine, category: "Interface" },
  { name: "RiSortLine", icon: RiSortLine, category: "Interface" },
  { name: "RiRefreshLine", icon: RiRefreshLine, category: "Interface" },
  { name: "RiDownloadLine", icon: RiDownloadLine, category: "Transfer" },
  { name: "RiUploadLine", icon: RiUploadLine, category: "Transfer" },
  { name: "RiShareLine", icon: RiShareLine, category: "Transfer" },
  { name: "RiPrintLine", icon: RiPrintLine, category: "Office" },
  { name: "RiCameraLine", icon: RiCameraLine, category: "Media" },
  { name: "RiImageLine", icon: RiImageLine, category: "Media" },
  { name: "RiVideoLine", icon: RiVideoLine, category: "Media" },
  { name: "RiMusicLine", icon: RiMusicLine, category: "Media" },
  { name: "RiFolderLine", icon: RiFolderLine, category: "Files" },
  { name: "RiFileLine", icon: RiFileLine, category: "Files" },
  { name: "RiArchiveLine", icon: RiArchiveLine, category: "Files" },
  { name: "RiInboxLine", icon: RiInboxLine, category: "Communication" },
  { name: "RiSendPlaneLine", icon: RiSendPlaneLine, category: "Communication" },
  { name: "RiReplyLine", icon: RiReplyLine, category: "Communication" },
  { name: "RiForwardLine", icon: RiForwardLine, category: "Communication" },
  { name: "RiEditLine", icon: RiEditLine, category: "Interface" },
  { name: "RiDeleteBinLine", icon: RiDeleteBinLine, category: "Interface" },
  { name: "RiAddLine", icon: RiAddLine, category: "Interface" },
  { name: "RiSubtractLine", icon: RiSubtractLine, category: "Interface" },
  { name: "RiCloseLine", icon: RiCloseLine, category: "Interface" },
  { name: "RiCheckLine", icon: RiCheckLine, category: "Interface" },
  { name: "RiStarLine", icon: RiStarLine, category: "Social" },
  { name: "RiHeartLine", icon: RiHeartLine, category: "Social" },
  { name: "RiThumbUpLine", icon: RiThumbUpLine, category: "Social" },
  { name: "RiBookmarkLine", icon: RiBookmarkLine, category: "Social" },
  { name: "RiFlagLine", icon: RiFlagLine, category: "Social" },
  { name: "RiEyeLine", icon: RiEyeLine, category: "Interface" },
  { name: "RiEyeOffLine", icon: RiEyeOffLine, category: "Interface" },
  { name: "RiVolumeUpLine", icon: RiVolumeUpLine, category: "Media" },
  { name: "RiVolumeDownLine", icon: RiVolumeDownLine, category: "Media" },
  { name: "RiVolumeMuteLine", icon: RiVolumeMuteLine, category: "Media" },
  { name: "RiPhoneLine", icon: RiPhoneLine, category: "Communication" },
  { name: "RiSmartphoneLine", icon: RiSmartphoneLine, category: "Device" },
  { name: "RiComputerLine", icon: RiComputerLine, category: "Device" },
  { name: "RiTvLine", icon: RiTvLine, category: "Device" },
  { name: "RiGamepadLine", icon: RiGamepadLine, category: "Entertainment" },
  { name: "RiHeadphoneLine", icon: RiHeadphoneLine, category: "Device" },
  { name: "RiMicLine", icon: RiMicLine, category: "Device" },
  { name: "RiWifiLine", icon: RiWifiLine, category: "Connectivity" },
  { name: "RiBluetoothLine", icon: RiBluetoothLine, category: "Connectivity" },
  { name: "RiBatteryLine", icon: RiBatteryLine, category: "Device" },
  { name: "RiFlashlightLine", icon: RiFlashlightLine, category: "Utility" },
  { name: "RiSunLine", icon: RiSunLine, category: "Weather" },
  { name: "RiMoonLine", icon: RiMoonLine, category: "Weather" },
  { name: "RiThunderstormsLine", icon: RiThunderstormsLine, category: "Weather" },
  { name: "RiRainyLine", icon: RiRainyLine, category: "Weather" },
  { name: "RiSnowyLine", icon: RiSnowyLine, category: "Weather" },
  { name: "RiWindyLine", icon: RiWindyLine, category: "Weather" },
  { name: "RiFireLine", icon: RiFireLine, category: "Nature" },
  { name: "RiLeafLine", icon: RiLeafLine, category: "Nature" },
  { name: "RiSeedlingLine", icon: RiSeedlingLine, category: "Nature" },
  { name: "RiTreeLine", icon: RiTreeLine, category: "Nature" },
  { name: "RiFlowerLine", icon: RiFlowerLine, category: "Nature" },
  { name: "RiBugLine", icon: RiBugLine, category: "Nature" },
  { name: "RiAntLine", icon: RiAntLine, category: "Nature" },
  { name: "RiFishLine", icon: RiFishLine, category: "Animals" },
  { name: "RiBirdLine", icon: RiBirdLine, category: "Animals" },
  { name: "RiCatLine", icon: RiCatLine, category: "Animals" },
  { name: "RiDogLine", icon: RiDogLine, category: "Animals" },
  { name: "RiCarLine", icon: RiCarLine, category: "Transport" },
  { name: "RiBusLine", icon: RiBusLine, category: "Transport" },
  { name: "RiTruckLine", icon: RiTruckLine, category: "Transport" },
  { name: "RiPlaneLine", icon: RiPlaneLine, category: "Transport" },
  { name: "RiRocketLine", icon: RiRocketLine, category: "Transport" },
  { name: "RiShipLine", icon: RiShipLine, category: "Transport" },
  { name: "RiBikeLine", icon: RiBikeLine, category: "Transport" },
  { name: "RiWalkLine", icon: RiWalkLine, category: "Activity" },
  { name: "RiRunLine", icon: RiRunLine, category: "Activity" },
  { name: "RiFootballLine", icon: RiFootballLine, category: "Sports" },
  { name: "RiBasketballLine", icon: RiBasketballLine, category: "Sports" },
  { name: "RiTennisLine", icon: RiTennisLine, category: "Sports" },
  { name: "RiPingPongLine", icon: RiPingPongLine, category: "Sports" },
  { name: "RiBoxingLine", icon: RiBoxingLine, category: "Sports" },
  { name: "RiMedal2Line", icon: RiMedal2Line, category: "Achievement" },
  { name: "RiTrophyLine", icon: RiTrophyLine, category: "Achievement" },
  { name: "RiAwardLine", icon: RiAwardLine, category: "Achievement" },
  { name: "RiGiftLine", icon: RiGiftLine, category: "Shopping" },
  { name: "RiCupLine", icon: RiCupLine, category: "Food" },
  { name: "RiRestaurantLine", icon: RiRestaurantLine, category: "Food" },
  { name: "RiHammerLine", icon: RiHammerLine, category: "Tools" },
  { name: "RiToolsLine", icon: RiToolsLine, category: "Tools" },
  { name: "RiScissorsLine", icon: RiScissorsLine, category: "Tools" },
  { name: "RiRulerLine", icon: RiRulerLine, category: "Tools" },
  { name: "RiCompassLine", icon: RiCompassLine, category: "Tools" },
  { name: "RiCalculatorLine", icon: RiCalculatorLine, category: "Tools" },
  { name: "RiMicroscopeLine", icon: RiMicroscopeLine, category: "Science" },
  { name: "RiFlaskLine", icon: RiFlaskLine, category: "Science" },
  { name: "RiTestTubeLine", icon: RiTestTubeLine, category: "Science" },
  { name: "RiCapsuleLine", icon: RiCapsuleLine, category: "Health" },
  { name: "RiStethoscopeLine", icon: RiStethoscopeLine, category: "Health" },
  { name: "RiFirstAidKitLine", icon: RiFirstAidKitLine, category: "Health" },
  { name: "RiHospitalLine", icon: RiHospitalLine, category: "Health" },
  { name: "RiAmbulanceLine", icon: RiAmbulanceLine, category: "Health" },
  { name: "RiPulseLine", icon: RiPulseLine, category: "Health" },
  { name: "RiMentalHealthLine", icon: RiMentalHealthLine, category: "Health" },
  { name: "RiShoppingCartLine", icon: RiShoppingCartLine, category: "Shopping" },
  { name: "RiShoppingBagLine", icon: RiShoppingBagLine, category: "Shopping" },
  { name: "RiStore2Line", icon: RiStore2Line, category: "Shopping" },
  { name: "RiBankLine", icon: RiBankLine, category: "Finance" },
  { name: "RiMoneyDollarCircleLine", icon: RiMoneyDollarCircleLine, category: "Finance" },
  { name: "RiCoinLine", icon: RiCoinLine, category: "Finance" },
  { name: "RiCreditCardLine", icon: RiCreditCardLine, category: "Finance" },
  { name: "RiWalletLine", icon: RiWalletLine, category: "Finance" },
  { name: "RiSafeLine", icon: RiSafeLine, category: "Finance" },
  { name: "RiScales2Line", icon: RiScales2Line, category: "Legal" },
  { name: "RiGavelLine", icon: RiGavelLine, category: "Legal" },
  { name: "RiGovernmentLine", icon: RiGovernmentLine, category: "Government" },
  { name: "RiPoliceCarLine", icon: RiPoliceCarLine, category: "Government" },
  { name: "RiFireTruckLine", icon: RiFireTruckLine, category: "Government" },
  { name: "RiSchoolLine", icon: RiSchoolLine, category: "Education" },
  { name: "RiBookLine", icon: RiBookLine, category: "Education" },
  { name: "RiGraduationCapLine", icon: RiGraduationCapLine, category: "Education" },
  { name: "RiPencilLine", icon: RiPencilLine, category: "Office" },
  { name: "RiPaintBrushLine", icon: RiPaintBrushLine, category: "Creative" },
  { name: "RiPaletteLine", icon: RiPaletteLine, category: "Creative" },
  { name: "RiArtboardLine", icon: RiArtboardLine, category: "Creative" },
  { name: "RiDraftLine", icon: RiDraftLine, category: "Creative" },
  { name: "RiLayoutLine", icon: RiLayoutLine, category: "Interface" },
  { name: "RiGridLine", icon: RiGridLine, category: "Interface" },
  { name: "RiTableLine", icon: RiTableLine, category: "Interface" },
  { name: "RiSidebarLine", icon: RiSidebarLine, category: "Interface" },
  { name: "RiMenuLine", icon: RiMenuLine, category: "Interface" },
  { name: "RiMore2Line", icon: RiMore2Line, category: "Interface" },
  { name: "RiLoader4Line", icon: RiLoader4Line, category: "Interface" }
]

const categories = Array.from(new Set(iconList.map(icon => icon.category)))

interface IconSelectorProps {
  value?: string
  onChange: (iconName: string) => void
  placeholder?: string
}

export default function IconSelector({ value, onChange, placeholder = "Sélectionner une icône" }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredIcons = iconList.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedIcon = iconList.find(icon => icon.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-12 p-3 text-left"
        >
          {selectedIcon ? (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-1 rounded bg-muted">
                <selectedIcon.icon size={20} />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium truncate">{selectedIcon.name}</span>
                <span className="text-xs text-muted-foreground">{selectedIcon.category}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <RiApps2Line size={16} className="text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">{placeholder}</span>
            </div>
          )}
          <RiMore2Line size={16} className="flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] max-w-[95vw] p-0" align="start" sideOffset={5}>
        <div className="p-4 border-b">
          <Input
            placeholder="Rechercher une icône..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(null)}
            >
              Toutes
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <ScrollArea className="h-[320px]">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4">
            {filteredIcons.filter(icon => icon.icon).map((icon) => (
              <Button
                key={icon.name}
                variant={value === icon.name ? "default" : "ghost"}
                size="sm"
                className="h-14 w-14 p-0 flex flex-col gap-1"
                onClick={() => {
                  onChange(icon.name)
                  setOpen(false)
                }}
                title={`${icon.name} (${icon.category})`}
              >
                <icon.icon size={18} />
                <span className="text-[10px] leading-none opacity-60 truncate max-w-full">
                  {icon.category}
                </span>
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <RiSearchLine size={24} className="mb-2" />
              <p className="text-sm">Aucune icône trouvée</p>
              <p className="text-xs">Essayez un autre terme de recherche</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}