import type { Meta, StoryObj } from "@storybook/react"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => (
    <Combobox>
      <ComboboxInput placeholder="Search..." />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="react">React</ComboboxItem>
          <ComboboxItem value="vue">Vue</ComboboxItem>
          <ComboboxItem value="svelte">Svelte</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}
