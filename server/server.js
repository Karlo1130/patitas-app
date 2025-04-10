import express from 'express';
import cors from 'cors'

//routes
import abuse_complaintRoutes from './routes/abuse_complaint.routes.js'
import loss_complaintRoutes from './routes/loss_complaint.routes.js'
import vaccinationRoutes from './routes/vaccination.routes.js'
import follow_upRoutes from './routes/follow-up.routes.js'
import adoptionRoutes from './routes/adoption.routes.js'
import profileRoutes from './routes/profile.routes.js'
import sign_upRoutes from './routes/sign_up.routes.js'
import serverRoutes from './routes/server.routes.js';
import loginRoutes  from './routes/login.routes.js';
import indexRoutes from './routes/index.routes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use(abuse_complaintRoutes);
app.use(loss_complaintRoutes);
app.use(vaccinationRoutes);
app.use(follow_upRoutes);
app.use(adoptionRoutes);
app.use(profileRoutes);
app.use(sign_upRoutes);
app.use(serverRoutes);
app.use(loginRoutes);
app.use(indexRoutes);


app.listen(5000,()=> {console.log("el servidor se inicializo en el puerto 5000")});
