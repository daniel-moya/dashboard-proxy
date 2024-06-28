Dashboard App Proxy
You can see the demo here: [https://dashboard-app-roan-eight.vercel.app/](https://dashboard-app-roan-eight.vercel.app/)

Built for second iteration of dashoard app, required since third part api doesn't allow for any (*) cross origin requests.

Uses a simple node express api listening on port 8080

# Build and run with Docker
Make sure docker is running on your localhost. You can build the image running directly the following command on your terminal.

```docker build . -t dashboard_proxy```

Then run the container based on the image you just built.

`docker run -d -p 80:8080 dashboard_proxy`

