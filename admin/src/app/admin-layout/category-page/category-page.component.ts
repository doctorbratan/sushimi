import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CategoryService } from "../../services/category.service";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit, OnDestroy {

  pending: boolean = false
  loading: boolean = false
  response = 
  {
    message: undefined as any,
    type: undefined as any
  }

  callback$!: Subscription
  categories$!: Subscription

  categories!: any[]

  category = 
  {
    _id: undefined as any,
    name: undefined as any,
    sub_categories: [] as any
  }

  edited_subcategory!: string

  constructor(
    private service: CategoryService
  ) { }

  ngOnInit(): void {
    this.get()
  }

  ngOnDestroy(): void {
  }

  sendMessage(data: any, type: boolean) {
    this.response.message = data
    this.response.type = type

    setTimeout(() => {
      this.response.message = undefined
    }, 2500);
  }

  get() {
    this.loading = true

    this.categories$ = this.service.get().subscribe(
      (data) => {
        this.categories = data
        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )

  }

  catch() {
    this.pending = true

    this.callback$ = this.service.catch(this.category).subscribe(
      (data) => {
        this.sendMessage(data.message, true)
        this.get()
        this.clean()
        this.pending = false
      },
      error => {
        this.sendMessage(error.error.message, false)
        console.warn(error)
        this.pending = false
      }
    )

  }

  delete() {
    this.pending = true

    this.callback$ = this.service.delete(this.category._id).subscribe(
      (data) => {
        this.sendMessage(data.message, true)
        this.get()
        this.clean()
        this.pending = false
      },
      error => {
        this.sendMessage(error.error.message, false)
        console.warn(error)
        this.pending = false
      }
    )
  }

  toEdit(item: any) {

    const category = Object.assign( {}, {
      _id: item._id,
      name: item.name,
      sub_categories: item.sub_categories
    })

    this.category = category

  }

  pushSubCategory() {
    const sub_category = Object.assign( {}, {
      name: this.edited_subcategory
    })
    this.category.sub_categories.push(sub_category)
    this.edited_subcategory = undefined!
  }

  deleteSubCategory(index: number) {
    this.category.sub_categories.splice(index, 1)
  }

  clean() {
    this.category._id = undefined!
    this.category.name = undefined!
    this.category.sub_categories = []
  }

}
