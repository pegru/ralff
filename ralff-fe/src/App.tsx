import {FormCard} from "./components/form-card.tsx";
import {Box} from "@mui/material";
import {URL_DESIGNED_LF, URL_HTML_LF, URL_SPF_V1, URL_SPF_V2} from "./utils/constants.ts";

function App() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
      <FormCard title={'HTML Login Form'}
                text={'Basic Login Form leveraging HTML default From Controls and validation mechanism.'}
                url={URL_HTML_LF}/>
      <FormCard title={'Designed Login Form'}
                text={'Design Login Form leveraging react-hook-from for handling form data. Submit only enabled after entering valid data.'}
                url={URL_DESIGNED_LF}/>
      <FormCard title={'Savings Plan Form V1'}
                text={'Advanced project to visualize possible input values requested for creating a saving plan.'}
                url={URL_SPF_V1}/>
      <FormCard title={'Savings Plan Form V2'}
                text={'Advanced project to visualize possible input values requested for creating a saving plan. Provides a flow for inputs.'}
                url={URL_SPF_V2}/>
    </Box>
  )
}

export default App
