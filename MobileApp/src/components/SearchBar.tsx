import { View } from "react-native"
import React from "react"
import { IconButton, Searchbar } from "react-native-paper"

type Props = {
  value: string
  onChange: (text: string) => void
  placeholder: string
  onFilterPress: () => void
}

const SearchBar = ({ value, onChange, placeholder, onFilterPress }: Props) => {
  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        mode="bar"
        right={(props) => (
          <IconButton {...props} icon="tune" onPress={onFilterPress} />
        )}
      />
    </View>
  )
}
export default SearchBar
