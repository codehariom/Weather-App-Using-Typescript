import type { WeatherData } from "@/Api/types"
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";


interface WeatherDetailProps{
    data:WeatherData;
}

const WeatherDetails = ({data}:WeatherDetailProps) => {
    const {wind,main,sys}=data

    const formateTime=(timestamp:number)=>{
        return format(new Date(timestamp*1000),"h:mm a")
    };

    const getWindDirections=(degree:number)=>{
        const directions=["N","NE","E","SE","S","SW","W","NW"]
        const index = Math.round(((degree%=360)<0?degree+360:degree)/45 ) %8
        return directions[index]
    }

    const details=[
        {
            title:"Sunrise",
            value:formateTime(sys.sunrise),
            icon:Sunrise,
            color:"text-oranage-500"
        },
        {
            title:"Sunset",
            value:formateTime(sys.sunset),
            icon:Sunset,
            color:"text-blue-500"
        },
        {
            title:"Wind Directions",
            value:`${getWindDirections(wind.deg)} (${wind.deg}°)`,
            icon:Compass,
            color:"text-green-500"
        },
        {
            title:"Pressure",
            value:`${main.pressure} hPa`,
            icon:Gauge,
            color:"text-purple-500"
        },
    ]
  return (
    <Card>
        <CardHeader>
            <CardTitle>Weather Details</CardTitle>
        </CardHeader>
        <CardContent>
            <div className=" grid gap-10 sm:grid-cols-2">
                {details.map((details)=>{
                    return <div key={details.title} className=" flex items-center gap-3 rounded-lg border p-4">
                        <details.icon className={`h-5 w-5 ${details.color}`}/>
                        <div>
                            <p className=" text-md font-medium leading-none">{details.title}</p>
                            <p className=" text-sm text-muted-foreground">{details.value}</p>
                        </div>

                    </div>
                })}
            </div>
        </CardContent>
    </Card>
  )
}

export default WeatherDetails