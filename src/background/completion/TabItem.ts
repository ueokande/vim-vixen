import TabFlag from "../../shared/TabFlag";

type TabItem = {
    index: number
    flag: TabFlag
    title: string
    url: string
    faviconUrl?: string
}

export default TabItem;