import React, { useState } from "react";
import { Alert, StyleSheet, Text, View,FlatList,TextInput,ScrollView, Image } from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";

//created a tab navigator to switch between the three different screens
const Tab= createBottomTabNavigator();

type Item = {
  name:string;
  description:string;
  category:string;
  price:string;
};

export default function App() {
  //a state to store all the menu items
  const [items, setItems] = useState<Item[]>([]);

  //Made a logo component to display the logo of the app
  const AppLogo = () => (
    <Image
    source={require('./assets/foodLogo.jpg')}
    style={styles.logo}
    resizeMode="contain"
    />
  )

  function HomeScreen(){
    //filters to seperate dishes by course/category
    const starters = items.filter(item => item.category === 'Starters');
    const mains = items.filter(item => item.category === 'Mains' );
    const desserts = items.filter (item => item.category === 'Desserts');

    //function used to calculate average price 
    const average = (arr: {price:string}[]) => {
      if (arr.length === 0) return 0;
      const total = arr.reduce((sum, item) => sum + parseFloat(item.price || "0"), 0);
      return (total / arr.length).toFixed(2);
    };

    //calculate average prices by course/category
    const avgStarters = average(starters);
    const avgMains = average(mains);
    const avgDesserts = average(desserts);

    return (
      <View style={styles.container}>
        <AppLogo/>
        <Text style={styles.header}>Chef's Menu</Text>
        <Text style={styles.number}>Total number of Dishes: {items.length}</Text>

        {/*The average price is displayed her */}
        <View style={styles.avgBox}>
          <Text style={styles.avgText}>Average Prices by Course:</Text>
          <Text style={styles.avgItem}>Starters: R{avgStarters}</Text>
          <Text style={styles.avgItem}>Mains: R{avgMains}</Text>
          <Text style={styles.avgItem}>Desserts: R{avgDesserts}</Text>
        </View>

        {/*Lists all menu items that have been added by the user in Add menu screen */}
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
        //shown when there are no menu items 
        ListEmptyComponent={
          <Text>No dishes added yet. Go to "Add Menu Screen" to add some menus!</Text>
        }
        style={{ width:'100%'}}
        />
      </View>
    );
  }

  function AddScreen() {
    //states for input fields
    const [name,setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    //Adds a new item to the list
    const handleAdd = () => {
      if (!name || !description || !category || !price ) {
        Alert.alert ('All the Information fields should be completed');
        return;
      }

      const newItem: Item = { name, description, category, price};
      setItems([...items, newItem]); //add to existing array

      // Reset input fields after adding
      setName('');
      setDescription('');
      setCategory('');
      setPrice('');

      Alert.alert ('The Menu Item has been added successfully');
    };

    // Deletes an existing item by name
    const handleDelete = (itemName: string) => {
      Alert.alert(
        'Delete Item',
        'Are You sure you want to delete the item',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedList = items.filter((item) => item.name !== itemName);
              setItems(updatedList);
            },
          },
        ]
      );
    };

    return(
      <ScrollView style={styles.container}>
        <AppLogo/>
        <Text style={styles.header}>Add A Dish Item</Text>

        {/*Input field to enter the name of the dish */}
        <TextInput
        placeholder="Dish Name:"
        value={name}
        onChangeText={setName}
        style={styles.input}
        />

        {/*Input field to enter the description of the dish */}
        <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        />

        {/*Category picker (Starters, Mains, Desserts) */}
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

        {/* Price input */}
        <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        />

        {/* Add button */}
        <Text
        style={styles.button}
        onPress={handleAdd}
        >Add Dish 
        </Text>

        {/* Display added dishes + delete icons */}
        <View style={{ marginTop: 20 }}>
          {items.length === 0 ? (
            <Text>No menu items added yet.</Text>
          ) : (
            items.map((item) => (
              <View key={item.name} style={styles.box}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemCategory}>Course: {item.category}</Text>
                    <Text style={styles.itemPrice}>R {parseFloat(item.price).toFixed(2)}</Text>
                  </View>
                  <Ionicons
                    name="trash"
                    size={22}
                    color="#DC2626"
                    onPress={() => handleDelete(item.name)}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  }

  function FilterScreen() {
    // Selected category for filtering
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter logic: show all or filter by category
    const filteredItems = items.filter(item => selectedCategory === 'All' ? true : item.category === selectedCategory);
    return(
      <View style={styles.container}>
        <AppLogo/>
        <Text style={styles.header}>Filter by course/catergory</Text>
        {/* Filter buttons */}
        <View style={styles.filterButtonContainer}>
          {['All', 'Starters', 'Mains', 'Desserts'].map((category) => (
            <Text 
              key={category} 
              style={[
                styles.filterButton,
                selectedCategory === category && styles.activeFilterButton,
              ]} 
              onPress={() => setSelectedCategory(category)}
            > 
              {category}
            </Text>
          ))}
        </View>
        {/* Filtered item list */}
        {filteredItems.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No dishes found.</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemCategory}>Course: {item.category}</Text>
                <Text style={styles.itemPrice}>R {parseFloat(item.price).toFixed(2)}</Text>
              </View>
            )}
          />
        )}
      </View>
    )
  }
  return (
   <NavigationContainer>
      <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({color, size }) => {
          // Icons for each tab
          if(route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color}/>
          }

          if(route.name === 'Add Menu') {
            return <Ionicons name="add-circle" size={size} color={color}/>
          }

          if(route.name === 'Filter Menu'){
            return <Ionicons name="filter" size={size} color={color}/>
          }
        },
      })}
      >
        {/* Tab Screens */}
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Add Menu" component={AddScreen}/>
        <Tab.Screen name="Filter Menu" component={FilterScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F2F6FF', 
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A', 
    marginBottom: 20,
    textAlign: 'center',
  },

  number: {
    fontSize: 16,
    color: '#334155', 
    textAlign: 'center',
    marginBottom: 15,
  },

  input: {
    width: '100%',
    borderColor: '#93C5FD', 
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
    color: '#1E3A8A', 
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

  button: {
    backgroundColor: '#2563EB', 
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

  box: {
    backgroundColor: '#E0F2FE', 
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', 
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
  avgBox: {
    backgroundColor: '#e0f2ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  avgText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#005f99',
  },
  avgItem: {
    fontSize: 14,
    color: '#0077cc',
  },

  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    backgroundColor: '#DBEAFE',
    paddingVertical: 8,
    borderRadius: 10,
  },

  filterButton: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
  },

  activeFilterButton: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    borderColor: '#1E40AF',
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },

});
