import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrashitemComponent } from '../trashitem/trashitem.component';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit{
  weatherDetails:any;
  constructor(@Inject(MAT_DIALOG_DATA) public trashItem: any, public dialogRef: MatDialogRef<TrashitemComponent>, private trashService: TrashService,
  public mapboxService: MapboxService,public dialog: MatDialog) { }
  ngOnInit(): void {
   this.trashService.getWeather(this.trashItem.latitude,this.trashItem.longitude,).subscribe((response:any)=>
   {
    this.weatherDetails=response;
    console.log(this.weatherDetails);
    
   });
  }
  getWeatherIconUrl(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  }

} 

