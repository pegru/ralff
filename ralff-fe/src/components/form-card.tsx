import {Heading} from 'monday-ui-react-core/next';
import {Box, Button, Flex} from 'monday-ui-react-core';
import {useNavigate} from 'react-router-dom';

interface FormCardProps {
  title: string,
  text: string,
  url: string
}

function FormCard(props: FormCardProps) {
  const navigate = useNavigate();

  return (
      <Flex direction={Flex.directions.ROW} style={{width: '60%', display: 'block'}}>
        <Box border={Box.borders.DEFAULT} rounded={Box.roundeds.MEDIUM}
             backgroundColor={Box.backgroundColors.GREY_BACKGROUND_COLOR} padding={Box.paddings.MEDIUM}>
          <Heading type={Heading.types.H2}>
            {props.title}
          </Heading>
          <p>
            {props.text}
          </p>
          <Button onClick={() => navigate(props.url)}>
            Open
          </Button>
        </Box>
      </Flex>

  );
}

export default FormCard;