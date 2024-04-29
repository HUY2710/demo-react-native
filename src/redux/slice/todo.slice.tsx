import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import http from '../../utils/http'
import { Todo } from '../../types/todo.type';

//redux gồm 3 phần chính Actions, Reducers, và Store.
//slice dùng để tạo reducer (kế hợp của createReducer và creatAction) -> action sẽ tự được generate 
// 1 reducer bao gồm state và action (createReducer(state, action)
// Cách hoạt động:+, interface (gửi event) -> actions
//                +, store (truyền và gửi dữ liệu) -> store chuyển action nhận từ interface -> reducer
//                +, reducer xử lý acion và trả về state mới
//                +, store cập nhật và đẩy state lên interface (dispatch là trung gian giúp quản lý và update state)
interface TodoSate {
  todos: Todo[]
  editingTodo: Todo | null
 
}

const initialState: TodoSate = {
  todos: [],
  editingTodo: null,
  
}

//get ra tất cả các todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await http.get<Todo[]>('todos',{
  });
  return response.data;
});

//thêm mới 1 todo
export const addTodo = createAsyncThunk('todos/addTodo', async (body: Omit<Todo, 'id'>, thunkAPI) => {
  try {
    const response = await http.post<Todo>('todos', body, {
      signal: thunkAPI.signal
    })
    return response.data
  } catch (error: any) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
//edit 1 tot
export const editTodoById = createAsyncThunk(
  'todos/editTodo',
  async ({ todoId, body }: { todoId: String; body: Todo }, thunkAPI) => {
    try {
      const response = await http.put<Todo>(`todos/${todoId}`, body, {
        signal: thunkAPI.signal
      })
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

//xóa 1 todo
export const deleteTodo = createAsyncThunk('todos/deleteTodos', async (todoId: String) => {
  const response = await http.delete<Todo>(`todos/${todoId}`, {
  })
  return response.data
})

const todosSlice = createSlice({
  name: 'todos',
  initialState: initialState,
  reducers: {
    startEditingTodo: (state, action: PayloadAction<string>) => {
      const todoId = action.payload
      const foundTodo = state.todos.find((todo) => todo.id === todoId) || null
      state.editingTodo = foundTodo
    },
    cancelEditingTodo: (state) => {
      state.editingTodo = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled,(state,action)=>{
      state.todos = action.payload 
    })
    .addCase(addTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload)
    })
    .addCase(editTodoById.fulfilled, (state, action) => {
      state.todos.find((todo, index) => {
        if (todo.id === action.payload.id) {
          state.todos[index] = action.payload
          return true
        }
        return false
      })
      state.editingTodo = null
    })
    .addCase(deleteTodo.fulfilled, (state, action) => {
      const todoId = action.meta.arg
      const deletePostIndex = state.todos.findIndex((todo) => todo.id === todoId)
      if (deletePostIndex !== -1) {
        state.todos.splice(deletePostIndex, 1)
      }
    })
  },
});

export const { cancelEditingTodo, startEditingTodo } = todosSlice.actions
export default todosSlice.reducer