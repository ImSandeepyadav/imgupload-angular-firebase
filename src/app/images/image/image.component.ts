import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  imgSrc : string;
  selectedImage: any =null;
  isSubmitted:boolean;

  formTemplate = new FormGroup({
    caption : new FormControl('',Validators.required),
    category : new FormControl(''),
    imageUrl : new FormControl('',Validators.required)
  })

  constructor(private storage: AngularFireStorage, private serivce: ImageService) { }

  ngOnInit(): void {
    this.resetForm();
  }

  showPreview(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else{
      this.imgSrc = "/assets/img/Flexible-Reusable-React-File-Uploader.png";
      this.selectedImage = null;
    }
  }

  onSubmit(formValue){
    this.isSubmitted = true;
    if(this.formTemplate.valid){
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
       finalize(()=>{
         fileRef.getDownloadURL().subscribe((url)=>{
           formValue['imageUrl']=url;
           this.serivce.insertImageDetail(formValue);
           this.resetForm();
         })
       })   
      ).subscribe();
    }
  }

  get formControl(){
    return this.formTemplate['controls']; 
  }

  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption:'',
      imageUrl:'',
      category:''
    });
    this.imgSrc = "/assets/img/Flexible-Reusable-React-File-Uploader.png";
    this.selectedImage=null;
    this.isSubmitted=false;
  }
}
