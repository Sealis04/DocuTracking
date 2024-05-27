module.exports = {
  apps : [
  {
    name:'EngineeringDocuTracking',
    script: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
    watch: 'true',
    args:'start',
    detached:true,
    exec_mode:"cluster",
    instances:1,
    env:{
      DATABASE_URL:"sqlserver://128.10.1.5:49173;database=engineerDocuTrack;user=sab;password=sab;trustServerCertificate=true;pool_timeout=43200;connectionLimit=100",
      SECRET_COOKIE_PASSWORD:"twdrEnarKrY5qDtLRLkvQMQwmKAjQdN2",
    }
  },
],
};