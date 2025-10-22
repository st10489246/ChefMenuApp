import React, { useState } from "react";
import { Alert, StyleSheet, Text, View,FlatList,TextInput } from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";

const Tab= createBottomTabNavigator();

type Item = {
  name:string;
  description:string;
  category:string;
  price:string;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);

  function HomeScreen(){
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Chefs Menu</Text>
        <Text style={styles.number}>Total number of Dishes: {items.length}</Text>

        <FlatList
        data={items}
        keyExtractor={(_,idx) => idx.toString()}
        renderItem={({ item}) => (
          <View style={styles. box}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemCategory}>Course: {item.category}</Text>
            <Text style={styles.itemPrice}>R: {item.price}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text>No dishes added yet. Go to "Add" to add some menus!</Text>
        }
        style={{ width:'100%'}}
        />
      </View>
    );
  }

  function AddScreen() {
    const [name,setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const handleAdd = () => {
      if (!name || !description || !category || !price ) {
        Alert.alert ('All the Information fields should be completed');
        return;
      }

      const newItem: Item = { name, description, category, price};
      setItems([...items, newItem]);

      setName('');
      setDescription('');
      setCategory('');
      setPrice('');

      Alert.alert ('The Menu Item has been added successfully');
    };

    return(
      <View style={styles.container}>
        <Text style={styles.header}>Add A Dish Item</Text>

        <TextInput
        placeholder="Dish Name:"
        value={name}
        onChangeText={setName}
        style={styles.input}
        />

        <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        />

        <Text style={styles.label}>Select Course</Text>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.picker}
        >
          <Picker.Item label="Starters" value="Starters" />
          <Picker.Item label="Mains" value="Mains" />
          <Picker.Item label="Desserts" value="Desserts" />
        </Picker>

        <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        />

        <Text
        style={styles.button}
        onPress={handleAdd}
        >Add Dish 
        </Text>
        
      </View>
    )
  }
  return (
   <NavigationContainer>
      <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({color, size }) => {
          if(route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color}/>
          }

          if(route.name === 'Add Book') {
            return <Ionicons name="add-circle" size={size} color={color}/>
          }
        },
      })}
      >
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Add Menu" component={AddScreen}/>
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 20,
  },
  number: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#90CAF9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    borderColor: '#90CAF9',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1565C0',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  box: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#BBDEFB',
    borderRadius: 8,
    width: '100%',
    borderLeftColor: "#1976D2",
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  itemDescription: {
    fontSize: 14,
    color: '#141414ff',
  },
  itemCategory: {
    fontWeight:"bold",
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1b1c1dff',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0686f5ff',
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: '#1976D2',
  },
});
