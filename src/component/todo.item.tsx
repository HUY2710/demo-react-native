import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Todo } from '../types/todo.type';

interface TodoItemType{
    todo: Todo,
    handleDelete: (todoId: String) => void
    handleEdit: (todoId: String) => void
}
export default function TodoItem ({ todo,handleEdit,handleDelete }:TodoItemType) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={()=>handleEdit(todo.id)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.button}  onPress={()=>handleDelete(todo.id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'pink',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal:16,
    borderRadius:50,width:'90%'
  },
  title: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: '#ddd',
  }
});


