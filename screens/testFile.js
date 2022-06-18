import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AlphabetList } from "react-native-section-alphabet-list";

const data = [
  { value: 'Lillie-Mai Allen', key: 'lCUTs2' },
  { value: 'Emmanuel Goldstein', key: 'TXdL0c' },
  { value: 'Winston Smith', key: 'zqsiEw' },
  { value: 'William Blazkowicz', key: 'psg2PM' },
  { value: 'Gordon Comstock', key: '1K6I18' },
  { value: 'Philip Ravelston', key: 'NVHSkA' },
  { value: 'Rosemary Waterlow', key: 'SaHqyG' },
  { value: 'Julia Comstock', key: 'iaT1Ex' },
  { value: 'Mihai Maldonado', key: 'OvMd5e' },
  { value: 'Murtaza Molina', key: '25zqAO' },
  { value: 'Peter Petigrew', key: '8cWuu3' },
]

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={{padding: 10}}>
      <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text.split(' ').map((word) => word && '🍕').join(' ')}
      </Text>
      <AlphabetList
        data={data}
        indexLetterStyle={{ 
          color: 'blue', 
          fontSize: 15,
        }}
        renderCustomItem={(item) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.listItemLabel}>{item.value}</Text>
          </View>
        )}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    top: 50
  },
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold'    
  }
});

export default PizzaTranslator;