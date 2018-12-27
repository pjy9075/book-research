import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

function BookItem(props) {
  return (
    <View
      style={{
        flexDirection: "row"
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          width: "40%"
        }}
      >
        <Image
          style={{ width: "80%", height: "80%" }}
          source={{ uri: props.image }}
        />
      </View>
      <TouchableOpacity onPress={props.onPressStar}>
        <Ionicons name={props.selected ? 'ios-star' : 'ios-star-outline'} size={50} />
      </TouchableOpacity>
      <View>
        <Text>{props.title}</Text>
        <Text>{props.publisher}</Text>
        <Text>{props.pubdate}</Text>
        <Text>{props.price}</Text>
      </View>

    </View>
  );
}

export default class App extends Component {
  state = {
    key: "javascript",
    bookItems: [],
    selected: {
      
    }
  }
  fetchBooks(page = 1) {
    const display = 10;
    const start = display * (page - 1) + 1;
    var query = this.state.key; //검색어 초기설정값 //key라고만 적으면 못찾음. fetchBooks 라는 함수 안에 key가 없어서

    return fetch(
      `https://openapi.naver.com/v1/search/book.json?query=${query}&display=${display}&start=${start}`,
      {
        headers: {
          "X-Naver-Client-Id": "vTiJhVKTgkFtmAOe1aRw",
          "X-Naver-Client-Secret": "KNnOp1CgQd"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        return responseJson.items;
      })
      .catch(error => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.fetchBooks().then(items => {
      //items : 네이버 책검색 api 에서 개별 검색 결과가 담긴 배열([])
      this.setState({
        bookItems: items
      });
    });
  }

  render() {
    let bookItemsWithSelected = this.state.bookItems.map((book) => {
      return {
        ...book,
        selected: this.state.selected[book.isbn]
      }
    });

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <TextInput
            style={{
              height: 40,
              width: "80%",
              borderColor: "gray",
              borderWidth: 1
            }}
            onChangeText={text => this.setState({ key: text })}
          />

          <Button
            onPress={() => {
              this.fetchBooks().then(items => {
                //네이버 책검색 api 에서 개별 검색 결과를 items라는 이름의 변수로 지정해놨다
                console.log(items);

                this.setState({
                  bookItems: items
                });
              });
            }}
            title="search"
            color="#841584"
          />
        </View>
        <FlatList
          data={bookItemsWithSelected}
          keyExtractor={(item) => item.isbn}
          renderItem={({ item }) => (
           
            <BookItem {...item}
              onPressStar={() => {
                
                this.setState({ // state의 변경은 반드시 setState
                  selected: {
                    ...this.state.selected,
                    [item.isbn]: !this.state.selected[item.isbn]
                    // 들어 가는 모습 "03204023 3204" : true 
                  }
                });
              }} />
          )}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },

  text: {
    color: "black",
    fontSize: 20
  }
});