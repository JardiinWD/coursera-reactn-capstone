/* ==== REACT IMPORTS ==== */
import { useEffect, useState, useCallback, useMemo } from "react";
import { Text, View, Alert, StyleSheet, Pressable, SectionList, Image } from "react-native";
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
/* ==== EXPO IMPORTS ==== */
import Constants from "expo-constants";
/* ==== CUSTOM IMPORTS ==== */
import debounce from "lodash.debounce";
import { initializeDatabase, fetchMenuItems, saveMenuItems, filterMenuItems } from "../database";
import Filters from "../components/Filters";
import { getInitials, getSectionListData } from "../utilities/utils";
import { styles } from '../utilities/style'
/* ==== API URL FOR FETCH === */
const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image  }) => (
  /* item */
  <View style={s.item}>
    {/* itemBody */}
    <View style={s.itemBody}>
      {/* name */}
      <Text style={s.plateName}>{name}</Text>
      {/* description */}
      <Text style={s.description}>{description}</Text>
      {/* price */}
      <Text style={s.price}>${price}</Text>
    </View>
    {/* itemImage */}
    <Image style={s.itemImage} 
      source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

const Home = ({ navigation, onLayout }) => {
  //#region useState Variables
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(Array(sections.length).fill(false))
  //#endregion 

  //#region fetchDataFromURL
  const fetchDataFromURL = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  //#endregion 

  //#region useEffects
  useEffect(() => {
    const loadMenuItemsAndProfile = async () => {
      try {
        await initializeDatabase();
        let menuItems = await fetchMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchDataFromURL();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const storedProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(storedProfile));
      } catch (error) {
        Alert.alert(error.message);
      }
    };
  
    loadMenuItemsAndProfile();
  }, []);


// Filters menu items based on selected filter selections and search query
  useEffect(() => {
    const filterMenuItems = async () => {
      const activeCategories = sections.filter((category, index) => {
        if (filterSelections.every(selection => selection === false)) {
          return true;
        }
        return filterSelections[index];
      });
      try {
        const filteredItems = await filterMenuItems(query, activeCategories);
        const sectionListData = getSectionListData(filteredItems);
        setData(sectionListData);
      } catch (error) {
        Alert.alert(error.message);
      }
    };

    filterMenuItems();
  }, [filterSelections, query]);
  //#endregion 

  // Updates the search query state
  const lookup = useCallback(q => {
    setQuery(q);
  }, []);

  // Debounces the lookup function to improve performance
  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  // Handles the change in the search bar text
  const handleSearchChange = text => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  // Handles the change in the filter selections
  const handleFiltersChange = index => {
    setFilterSelections(prevSelections => {
      const newSelections = [...prevSelections];
      newSelections[index] = !prevSelections[index];
      return newSelections;
    });
  };

  return (
    <View style={s.rootContainer} onLayout={onLayout}>
      {/* headerContainer */}
      <View style={s.headerContainer}>
        {/* logoImage */}
        <Image
          style={s.logoImage}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon"}
        />
        {/* avatar */}
        <Pressable
          style={s.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={s.avatarImage} />
          ) : (
            <View style={s.avatarEmpty}>
              <Text style={s.avatarEmptyText}>
                {getInitials(profile.firstName, profile.lastName)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      {/* heroSection */}
      <View style={s.heroSection}>
        {/* heroHeader */}
        <Text style={s.heroHeader}> 
          Little Lemon 
        </Text>
        {/* heroContainerBody */}
        <View style={s.heroContainerBody}>
          {/* heroContent */}
          <View style={s.heroContent}>
            <Text style={s.innerHeroHeader}>
              Chicago
            </Text>
            {/* heroText */}
            <Text style={s.heroText}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          {/* heroImage */}
          <Image
            style={s.heroImage}
            source={require("../img/restauranfood.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        {/* searchBar */}
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={s.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
      </View>
      <Text style={s.delivery}>
        {"Order for delivery!".toUpperCase()}
      </Text>
      {/* filterSelections */}
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={s.sectionList}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={s.itemHeader}>{name}</Text>
        )}
      />
    </View>
  );
};

const s = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: styles.colorPalette.primary_white,
    paddingTop: Constants.statusBarHeight,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#dee3e9",
  },
  logoImage: {
    height: styles.commonDimensions.height_50,
    width: styles.commonDimensions.width_150,
    resizeMode: "contain",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: styles.textStyle.font_size_xl,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: styles.colorPalette.primary_white,
    fontFamily: styles.fontFamily.Karla_ExtraBold,
  },
  plateName: {
    fontSize: styles.textStyle.font_size_l,
    color: styles.colorPalette.primary_black,
    paddingBottom: 5,
    fontFamily: styles.fontFamily.Karla_Bold,
  },
  description: {
    color: "#495e57",
    fontFamily: styles.fontFamily.Karla_Medium,
    paddingRight: 5,
  },
  price: {
    fontFamily: styles.fontFamily.Karla_Medium,
    fontSize: styles.textStyle.font_size_l,
    paddingTop: 7,
    color: "#e97f4e",
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  itemImage: {
    width: styles.commonDimensions.width_100,
    height: styles.commonDimensions.height_100,
  },
  avatarEmpty: {
    width: styles.commonDimensions.width_100,
    height: styles.commonDimensions.height_100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: styles.colorPalette.primary_success,
  },
  avatarImage: {
    width: styles.commonDimensions.width_50,
    height: styles.commonDimensions.height_50,
    borderRadius: 25,
  },
  heroSection: {
    backgroundColor: styles.colorPalette.button_save,
    padding: 15,
  },
  heroHeader: {
    fontFamily: styles.fontFamily.MarkaziText_Medium,
    fontSize: styles.textStyle.font_size_3xl,
    color: styles.colorPalette.button_primary,
  },
  heroImage: {
    width: styles.commonDimensions.width_100,
    height: styles.commonDimensions.height_100,
    borderRadius: 12,
  },
  innerHeroHeader: {
    fontFamily: styles.fontFamily.MarkaziText_Medium,
    fontSize: styles.textStyle.font_size_xxl,
    color: styles.colorPalette.primary_white,
  },
  delivery: {
    fontFamily: styles.fontFamily.Karla_ExtraBold,
    fontSize: styles.textStyle.font_size_l,
    padding: 15,
  },
  heroText: {
    color: styles.colorPalette.primary_white,
    fontSize: styles.textStyle.font_size_xs,
    fontFamily: styles.fontFamily.Karla_Medium,
  },
  heroContent: {
    flex: 1,
  },
  heroContainerBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Home;