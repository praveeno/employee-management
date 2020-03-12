import React, { Component } from 'react';
import { Modal, Button, Input, Tooltip, Steps } from 'antd';
import { connect } from 'react-redux';
import { emailRegex, convertFlatObjectToNested, containValue, convertNestedObjectToFlat } from '../utils';
import {
  InfoCircleOutlined,
  UserOutlined,
  SoundOutlined,
  ClusterOutlined,
  TeamOutlined,
  ShopOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  InteractionOutlined
} from '@ant-design/icons';
import {
  openAddEmployeeModel,
  onAddEmployeeStepperUpdate,
  addEmployee,
  closeAddEmployeeModel
} from '../actions/employeeAddAction';
import { updateEmployee } from '../actions/employeeUpdateAction';
const { Step } = Steps;

class EmployeeAdd extends Component {
  id;
  formConfigs = [
    {
      placeholder: 'Enter your Name',
      name: 'name',
      inputType: 'text',
      prefixIcon: <UserOutlined />
    },
    {
      placeholder: 'Enter your Email',
      name: 'email',
      inputType: 'email',
      prefixIcon: <MailOutlined />,
      validator: value => emailRegex.test(value),
      validationError: 'Email is not valid!'
    },
    {
      placeholder: 'Enter your Phone',
      name: 'phone',
      inputType: 'phone',
      prefixIcon: <PhoneOutlined />,
      validator: value => !isNaN(value) && value.length >= 10,
      validationError: 'phone number should contain 10 number digit'
    },
    {
      placeholder: 'Enter Address Suite',
      name: 'address.suite',
      inputType: 'text',
      tooltip: 'Apartmant or Flat number',
      prefixIcon: <HomeOutlined />
    },
    {
      placeholder: 'Enter your Street',
      name: 'address.street',
      inputType: 'text',
      prefixIcon: <ShopOutlined />
    },
    {
      placeholder: 'Enter your City',
      name: 'address.city',
      inputType: 'text',
      prefixIcon: <ShopOutlined />
    },
    {
      placeholder: 'Enter ZipCode',
      name: 'address.zipcode',
      inputType: 'text',
      prefixIcon: <ShopOutlined />
    },
    {
      placeholder: 'Enter username',
      name: 'username',
      inputType: 'text',
      prefixIcon: <TeamOutlined />,
      validator: value => value.split(' ').length <= 1,
      validationError: 'username should not contain space',
      tooltip: 'username should not contain space'
    },
    {
      placeholder: 'Enter Company Name',
      name: 'company.name',
      inputType: 'text',
      prefixIcon: <ClusterOutlined />
    },
    {
      placeholder: 'Enter Company Catch Phrase',
      name: 'company.catchPhrase',
      inputType: 'text',
      tooltip: 'Describe your company in short way',
      prefixIcon: <SoundOutlined />
    },
    {
      placeholder: 'Enter Company Website',
      name: 'website',
      addonBefore: 'http://',
      inputType: 'text',
      tooltip: 'Describe your company in short way',
      prefixIcon: <InteractionOutlined />
    }
  ];
  stepperDestribution = [
    // first 6 inputs in formConfigs are personalInfo
    Array.from(Array(7).keys(), v => this.formConfigs[v]),
    // remain are commpany info
    Array.from(Array(this.formConfigs.length - 7).keys(), v => this.formConfigs[v + 7])
  ];

  // local state, when form is valid will save in redux store
  state = {
    ...this.getFormFieldsAsHashMap(this.formConfigs),
    errors: this.getFormFieldsAsHashMap(
      this.formConfigs.filter(input => !input.validator) /**InputContainValidation */
    ),
    formInvalid: false
  };

  getFormFieldsAsHashMap(form, oldForm = {}) {
    return form.reduce(
      (prev, current) => ({
        ...prev,
        [current.name]: oldForm[current.name] || ''
      }),
      {}
    );
  }

  handleFieldChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    const inputControl = this.formConfigs.find(f => f.name === name);
    if (inputControl.validator && !inputControl.validator(value)) {
      errors[name] = inputControl.validationError;
    } else {
      errors[name] = '';
    }
    const isFormStateValid = containValue({ ...this.state, errors: null, formInvalid: null });
    if (isFormStateValid) {
      this.setState({ formInvalid: false });
    }
    this.setState({ errors, [name]: value });
  };
  showModal = () => {
    this.props.dispatch(openAddEmployeeModel);
  };

  onChange = current => {
    this.props.dispatch(onAddEmployeeStepperUpdate(current));
  };

  handleCancel = () => {
    this.clearFormState();
    this.props.dispatch(closeAddEmployeeModel);
  };

  showForm(current, index) {
    return {
      display: current === index ? 'initial' : 'none'
    };
  }

  createInput = (input, key) => {
    return (
      <div key={key.toString()}>
        <Input
          size="large"
          style={{ marginTop: 12 }}
          placeholder={input.placeholder}
          onChange={this.handleFieldChange}
          onBlur={this.handleFieldChange}
          addonBefore={input.addonBefore || ''}
          defaultValue={this.state[input.name]}
          noValidate
          name={input.name}
          type={input.type}
          prefix={input.prefixIcon}
          suffix={
            input.tooltip ? (
              <Tooltip title={input.tooltip}>
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            ) : (
              <span></span>
            )
          }
        />
        <span style={{ color: 'red', fontSize: 12, marginLeft: 14 }}>{this.state.errors[input.name]}</span>
      </div>
    );
  };

  handleSubmit = event => {
    const { onSave, isEditing } = this.props;
    event.preventDefault();

    // if found value str in errors, then not valid
    const shouldContainNoError = !containValue(this.state.errors);
    // consider all input fields required
    const isFormStateValid = containValue({ ...this.state, errors: null, formInvalid: null });

    if (isFormStateValid && shouldContainNoError) {
      const employeeFormState = { ...this.state, errors: null, formInvalid: null };
      const employee = convertFlatObjectToNested(employeeFormState);
      employee.id = this.id;
      // TODO:// close modal only when this async function finish
      // TODO:// move this api call to outside of this component and call from parent compoenent
      if (isEditing) {
        this.props.dispatch(updateEmployee(this.id, employee));
      } else {
        this.props.dispatch(addEmployee(employee));
      }
      this.handleCancel();
      this.props.dispatch(onSave(employee, isEditing)); // notify parent
      // clear form
      this.clearFormState();
    } else {
      this.setState({ formInvalid: true });
    }
  };

  clearFormState = () => {
    this.setState({
      ...this.getFormFieldsAsHashMap(this.formConfigs, {})
    });
  };
  editEmployee(employee) {
    const flatEmployeeStructure = convertNestedObjectToFlat(employee);
    this.id = flatEmployeeStructure.id;
    this.setState({
      ...this.getFormFieldsAsHashMap(this.formConfigs, flatEmployeeStructure)
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.employee !== this.props.employee) {
      if (this.props.employee) {
        this.editEmployee(this.props.employee);
      }
    }
  }

  render() {
    const { formInvalid } = this.state;
    const { visible, loading, current } = this.props;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add Employee
        </Button>
        <Modal
          destroyOnClose={true}
          maskClosable={false}
          visible={visible}
          title="Add Employee"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          footer={[
            <span
              key="invalid"
              style={{
                ...this.showForm(formInvalid, true),
                paddingRight: 12,
                color: 'red'
              }}
            >
              Form Not Valid
            </span>,
            <Button key="back" onClick={() => this.onChange(0)} style={this.showForm(current, 1)}>
              Back
            </Button>,
            <Button key="next" onClick={() => this.onChange(1)} style={this.showForm(current, 0)} type="primary">
              Next
            </Button>,
            <Button
              style={this.showForm(current, 1)}
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          ]}
        >
          <Steps
            type="navigation"
            size="small"
            current={current}
            onChange={this.onChange}
            className="site-navigation-steps"
          >
            <Step title="Personal Info" />
            <Step title="Company Info" />
          </Steps>
          <form onSubmit={this.handleSubmit} noValidate>
            {this.stepperDestribution.map((form, i) => (
              <div key={i.toString()} style={this.showForm(current, i)}>
                {form.map((inputConfig, j) => this.createInput(inputConfig, j))}
              </div>
            ))}
          </form>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    employee: state.employeeAddReducer.employee,
    loading: state.employeeAddReducer.loading,
    visible: state.employeeAddReducer.visible,
    current: state.employeeAddReducer.currentStep,
    isEditing: state.employeeAddReducer.editing
  };
};

export default connect(mapStateToProps)(EmployeeAdd);
