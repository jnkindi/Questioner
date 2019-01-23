
import app from '../app';

const port = process.env.PORT || '3000';

const listen = () => {
  console.log(`Running on ${port}`);
};

app.listen(port, listen());