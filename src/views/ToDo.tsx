import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';
import {
    View,Text,SafeAreaView,FlatList,TouchableOpacity
} from 'react-native'
import { RootState, useAppDispatch } from '../redux/store';
import TodoItem from '../component/todo.item';
import {addTodo, deleteTodo, editTodoById, fetchTodos} from '../redux/slice/todo.slice'
import { Todo } from '../types/todo.type';
export default function ToDo() {

    const todoList = useSelector((state:RootState)=> state.todo.todos)
    const dispatch = useAppDispatch()
    const [dialogVisible, setDialogVisible] = useState(false);
    const [textValue, setTextValue] = useState('');
    const initialState: Todo = {
      id:'',
      title: '',
      completed: false
    }
    const [formData, setFormData] = useState<Todo>(initialState);
    useEffect(() => {
      const promise = dispatch(fetchTodos())
      return () => {
        console.log("ABC");
        promise.abort()
        console.log("ABC");
      }
    }, [dispatch])

    const handleEdit = async(todoId: String) => {
      dispatch(
        editTodoById({
          todoId: todoId,
          body: {
            id:todoId,
            title: 'Đã sửa todo này',
            completed: false
           }
        })
      )
        .unwrap()
        .then(() => {
          setFormData(initialState)
          
        })
        .catch((error) => {
          console.log("error")
        })
    }

    const handleDelete = (todoId: String)=> {
      dispatch(deleteTodo(todoId))
    } 

    const handleAddTodo = async() => {
      try {
        await dispatch(addTodo( {
         title: 'Đã thêm todo moi',
          completed: false
        })).unwrap()
       
      } catch (error: any) {
       console.log("error")
      }
    }
  

    return (
       <SafeAreaView>
         <View style={{justifyContent:'center',alignItems:'center', height:'100%',width:'100%',backgroundColor:'white'}}>
        <TouchableOpacity onPress={handleAddTodo} style={{justifyContent:'center',alignItems:'center',width:'50%',height:50,backgroundColor:'red',marginBottom:20,borderRadius:50,marginTop:50}}>
          <Text style={{color:'white',fontSize:24,fontWeight:800}}>Add todo</Text>
        </TouchableOpacity>
         
         <FlatList
            data={todoList}
            renderItem={({item}) => <TodoItem todo={item} handleDelete={handleDelete} handleEdit={handleEdit} />}
            keyExtractor={item => item.id.toString()} 
          />
        </View>
       </SafeAreaView>
    );

  }
  