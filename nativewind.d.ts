import 'react-native'

declare module 'react-native' {
  interface ViewProps {
    className?: string
  }
  interface TextProps {
    className?: string
  }
  interface TextInputProps {
    className?: string
  }
  interface TouchableOpacityProps {
    className?: string
  }
  interface SafeAreaViewProps {
    className?: string
  }
  interface FlatListProps<T> {
    contentContainerClassName?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      View: any
      Text: any
      TextInput: any
      TouchableOpacity: any
      SafeAreaView: any
      FlatList: any
    }
  }
}
