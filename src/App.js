import React from 'react';
import { Row, PageHeader } from 'antd';
import EmployeeList from './components/Employee-List';
import EmployeeAdd from './components/Employee-Add';
import { addEmployeeToEmployees } from './actions/employeeFetchAction';

import './App.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
      <PageHeader
        ghost={false}
        title="Employee Management"
        subTitle="this is active employee list"
        extra={[
          <Row key={0} justify="end">
            {/* need to refetch employee list, again but as jsonplaceholder
      dont save data, will just update employees list in memeory  */}
            <EmployeeAdd onSave={addEmployeeToEmployees}></EmployeeAdd>
          </Row>
        ]}
      />
      <EmployeeList></EmployeeList>
    </div>
  );
}
export default App;
