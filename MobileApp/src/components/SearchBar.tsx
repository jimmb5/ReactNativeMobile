import { View } from "react-native"
import React from "react"
import { IconButton, Searchbar } from "react-native-paper"
import { colors } from "../theme/colors"

type Props = {
  value: string
  onChange: (text: string) => void
  placeholder: string
  onFilterPress: () => void
  style?: any
}

const SearchBar = ({
  value,
  onChange,
  placeholder,
  onFilterPress,
  style,
}: Props) => {
  return (
    <View style={style}>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        mode="bar"
        style={{ backgroundColor: colors.background }}
        right={(props) => (
          <IconButton {...props} icon="tune" onPress={onFilterPress} />
        )}
      />
    </View>
  )
}
export default SearchBar
