import './App.css';
import {Flex} from "monday-ui-react-core";
import FormCard from './components/form-card';
import MainPage from './components/main-page/main-page';

function App() {
  return (
    <MainPage>
      <Flex gap={Flex.gaps.SMALL} direction={Flex.directions.COLUMN} align={Flex.align.START}>
        <FormCard title={'HTML Login Form'}
                  text={'Basic Login Form leveraging HTML default From Controls and validation mechanism.'}
                  url={'/loginForm/html'}/>
        <FormCard title={'Designed Login Form'}
                  text={'Design Login Form leveraging react-hook-from for handling form data. Submit only enabled after entering valid data.'}
                  url={'/loginForm/designed'}/>
        <FormCard title={'Savings Plan Form V1'}
                  text={'Advanced project to visualize possible input values requested for creating a saving plan.'}
                  url={'/savingsForm/v1'}/>
        <FormCard title={'Savings Plan Form V2'}
                  text={'Advanced project to visualize possible input values requested for creating a saving plan. Provides a flow for inputs.'}
                  url={'/savingsForm/v2'}/>
      </Flex>
    </MainPage>
  );
}

export default App;
