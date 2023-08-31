import jwtFetch from './jwt.js';

export const ADD_EXPENSE = 'expenses/ADD_EXPENSE';
export const FETCH_EXPENSES = 'expenses/FETCH_EXPENSES';
export const DELETE_EXPENSE = 'expenses/DELETE_EXPENSE';

export const addExpenseAction = (expense) => ({
    type: ADD_EXPENSE,
    payload: expense
  });
  
  export const fetchExpensesAction = (expenses) => ({
    type: FETCH_EXPENSES,
    payload: expenses
  });
  
  export const deleteExpenseAction = (deletedExpensesId) => ({
    type: DELETE_EXPENSE,
    deletedExpensesId
});
  export const addExpense = (expenseData) => {
    return async (dispatch, getState) => {
      const state = getState();
      const user = state.session.user;
  
      const response = await jwtFetch('/api/expenses', {
        method: "POST",
        body: JSON.stringify({
          ...expenseData,
          user: user._id
        })
      });
  
      const data = await response.json();
      dispatch(addExpenseAction(data));
    };
  };
  
  export const fetchExpenses = (startDate, endDate) => {
    return async (dispatch) => {
      let url = '/api/expenses';
  
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
  
      const response = await jwtFetch(url);
      const data = await response.json();
      dispatch(fetchExpensesAction(data));
    };
  };
  
  export const deleteExpense = (expenseId) => async (dispatch) => {
    try {
    await jwtFetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
    });

    dispatch(deleteExpenseAction(expenseId));
    } catch (error) {
    console.error('Error deleting expense:', error);
    }
};

  const initialState = [];

  const expensesReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_EXPENSE:
        return [...state, action.payload];
      case FETCH_EXPENSES:
        return action.payload;
      case DELETE_EXPENSE:
        return state.filter((expenses) => expenses._id !== action.deletedExpensesId);
      default:
        return state;
    }
  };
  
  export default expensesReducer;
  