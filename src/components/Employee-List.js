import React, { Component } from 'react';
import { Table, Button, Popconfirm, Spin, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { fetchEmployees, deleteEmployeeToEmployees } from '../actions/employeeFetchAction';
import { editEmployee } from '../actions/employeeAddAction';
import { connect } from 'react-redux';
import { deleteEmployee } from '../actions/employeeDeleteAction';

class EmployeeList extends Component {
  columns;
  state = {
    selectedRowKeys: [],
    employees: null
  };
  onChange = selectedRowKeys => {
    console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  _deleteEmployee = id => {
    debugger;
    this.props.dispatch(deleteEmployee(id));
    // TODO: //call this when above async function resolve
    this.props.dispatch(deleteEmployeeToEmployees(id));
  };

  _editEmployee = id => {
    const { employees } = this.props;
    const employee = employees.find(e => e.id === id);
    this.props.dispatch(editEmployee(employee));
  };

  componentDidMount() {
    this.columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Address', dataIndex: 'formatted_address', key: 'formatted_address' },
      { title: 'Phone', dataIndex: 'phone', key: 'phone' },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        render: (key, data) => (
          <div key={(key || 1).toString()}>
            <Button onClick={() => console.log(this._editEmployee(key))} icon={<EditOutlined />} />
            <Popconfirm
              title="you want to delete this employee？"
              okText="obviously"
              cancelText="No, my mistake"
              onConfirm={() => this._deleteEmployee(key)}
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        )
      }
    ];
    this.props.dispatch(fetchEmployees());
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { error, employees, pending } = this.props;
    const _employees = employees.map(user => {
      const address = user.address;
      user.key = user.id; // Table need unique ref as key
      user.formatted_address = `${address.suite} ${address.street} ${address.city}`;
      return user;
    });
    if (error) {
      return <div>Error! {error.message}</div>;
    }
    if (pending) {
      return (
        <Row key={0} justify="center">
          <Spin tip="Loading Employees List.."></Spin>
        </Row>
      );
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onChange
    };
    return <Table rowSelection={rowSelection} columns={this.columns} dataSource={_employees} />;
  }
}
const mapStateToProps = state => ({
  employees: state.employeeListReducer.employees,
  error: state.employeeListReducer.error,
  pending: state.employeeListReducer.pending
});

export default connect(mapStateToProps)(EmployeeList);
