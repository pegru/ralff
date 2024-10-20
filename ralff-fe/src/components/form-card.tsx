import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export interface FormCardProps {
  title: string;
  text: string;
  url: string;
}

export const FormCard = ({title, text, url}: FormCardProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{maxWidth: '50%', bgcolor: 'rgba(218,218,218,0.93)'}} elevation={10}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{color: 'text.secondary'}}>
          {text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant='contained' size="small" color="primary" onClick={() => navigate(url)}>
          Open
        </Button>
      </CardActions>
    </Card>
  );
};
