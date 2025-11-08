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
        <Text style={styles.header}>Chef's Menu</Text>
        <Text style={styles.number}>Total number of Dishes: {items.length}</Text>

        <FlatList
        data={items}
        keyExtractor={(item) => item.name}
        renderItem={({ item}) => (
          <View style={styles.box}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemCategory}>Course: {item.category}</Text>
            <Text style={styles.itemPrice}>R {parseFloat(item.price).toFixed(2)}</Text>
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

          if(route.name === 'Add Menu') {
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
    backgroundColor: '#F2F6FF', // soft blue-tinted background
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  // Header Titles
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A', // deep navy blue
    marginBottom: 20,
    textAlign: 'center',
  },

  // Total count label
  number: {
    fontSize: 16,
    color: '#334155', // neutral dark gray-blue
    textAlign: 'center',
    marginBottom: 15,
  },

  // Input fields
  input: {
    width: '100%',
    borderColor: '#93C5FD', // soft sky blue border
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1E3A8A', // same navy tone as header
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  picker: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#93C5FD',
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    color: '#1E293B',
  },

  // Add Dish Button
  button: {
    backgroundColor: '#2563EB', // strong medium blue
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 18,
    fontSize: 16,
    letterSpacing: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  // Each dish card
  box: {
    backgroundColor: '#E0F2FE', // light sky blue background for cards
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // bright blue accent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },

  itemDescription: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
  },

  itemCategory: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1E40AF',
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 6,
  },
});
