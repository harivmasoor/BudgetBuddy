import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIncome } from '../../store/incomes';
import { fetchIncomeCategories } from '../../store/incomeCategories';
import './Income.css';
import { getCurrentMonthYear } from '../../Util/dateUtil';


function IncomeInput() {
  const incomeCategories = useSelector(state => state.incomeCategories);
  const [selectedInterval, setSelectedInterval] = useState('monthly');
  const dispatch = useDispatch();
  const [incomeData, setIncomeData] = useState({
    incomesource: '', 
    incomeamount: '',  
    category: incomeCategories.length > 0 ? incomeCategories[0]._id : '',
    notes:'',
    date:'',
    endDate: selectedInterval,
    startDate:''
  });

  useEffect(() => {
    dispatch(fetchIncomeCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setIncomeData({
      ...incomeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {startDate, endDate} = getCurrentMonthYear(selectedInterval, incomeData.date)
    dispatch(addIncome({...incomeData, endDate,startDate}));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="incomesource">Income Source:</label>
        <input 
          type="text" 
          id="incomesource" 
          name="incomesource" 
          value={incomeData.incomesource} 
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="incomeamount">Income Amount($):</label>
        <input 
          type="number" 
          id="incomeamount" 
          name="incomeamount" 
          value={incomeData.incomeamount} 
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea 
          id="notes" 
          name="notes" 
          value={incomeData.notes} 
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select 
          id="category" 
          name="category" 
          value={incomeData.category} 
          onChange={handleChange}
        >
          <option value="" disabled>Select a category</option>
          {incomeCategories.map((category, index) => (
            <option key={index} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="incomedate">Date:</label>
        <input 
          type="date" 
          id="incomedate" 
          name="date" 
          value={incomeData.date} 
          onChange={handleChange}
        />
      </div>
      <label>
            Select Income Interval:
            <select
              value={selectedInterval}
              onChange={(e) => setSelectedInterval(e.target.value)}
              >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
      </label>
      <button type="submit">Add Income</button>
    </form>
  );
}

export default IncomeInput;

