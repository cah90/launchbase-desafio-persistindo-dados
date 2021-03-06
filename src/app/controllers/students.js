const { age, date, grade} = require('../lib/utils')
const Student = require("../models/student")
const Intl = require("intl")

module.exports = {
  index(req, res) {
    let {filter, page, limit} = req.query
    
    page = page || 1 //número da página
    limit = limit || 2 //quantos teachers vai trazer

    let offset = limit * (page - 1) //trará os elements a partir do valor resultante da expressão

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        const pagination = {
          total: Math.ceil(students[0].total/limit),
          page
        }
        return res.render("students/index", { 
          students, 
          filter, 
          pagination, 
          options: {
          "5EF": "5º ano do ensino fundamental",
          "6EF": "6º ano do ensino fundamental",
          "7EF": "7º ano do ensino fundamental",
          "8EF": "8º ano do ensino fundamental",
          "9EF": "9º ano do ensino fundamental",
          "1EM": "1º ano do ensino médio",
          "2EM": "2º ano do ensino médio",
          "3EM": "3º ano do ensino médio"
        }  })
      }
    }
    Student.paginate(params)
  },

  create(req, res) {
    Student.teachersSelectedOptions( (options) => {

      return res.render("students/create", {
        teacherOptions: options,
        options: {
        "5EF": "5º ano do ensino fundamental",
        "6EF": "6º ano do ensino fundamental",
        "7EF": "7º ano do ensino fundamental",
        "8EF": "8º ano do ensino fundamental",
        "9EF": "9º ano do ensino fundamental",
        "1EM": "1º ano do ensino médio",
        "2EM": "2º ano do ensino médio",
        "3EM": "3º ano do ensino médio"
        }
      })
    })
  },

  post(req, res) {
    console.log("req.body")
    console.log(req.body)

    const keys = Object.keys(req.body) //array com as keys do objeto

    //* Checando se todos os campos estão preenchidos
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all the gaps")
      }
    }

    Student.create( req.body, (student) => {
      return res.redirect(`/students/${student.id}`)
    })
  },

  edit(req, res) {
    Student.find(req.params.id, (student) => {
      if(!student) return res.send("Student was not found!")

      student.birth = date(student.birth).iso

      Student.teachersSelectedOptions( (options) => {
        
        return res.render("students/edit", {
          student,
          teacherOptions: options,
          options: {
          "5EF": "5º ano do ensino fundamental",
          "6EF": "6º ano do ensino fundamental",
          "7EF": "7º ano do ensino fundamental",
          "8EF": "8º ano do ensino fundamental",
          "9EF": "9º ano do ensino fundamental",
          "1EM": "1º ano do ensino médio",
          "2EM": "2º ano do ensino médio",
          "3EM": "3º ano do ensino médio"
          }
        })
      })
    })
  },

  show(req, res) {
    console.log("students controller show() was  called")

    Student.find(req.params.id, (student) => {
      if(!student) return res.send("Student was not found!")

      if(!(student.avatar_url.startsWith('http://') || student.avatar_url.startsWith('https://') )) {
        return res.status(404).send("Student does not have a correct avatar_url!")
      }

      student.birth = date(student.birth).birthDay
      student.school_year = grade(student.school_year)
      

     return res.render("students/show", {
       student, 
      options: {
        "5EF": "5º ano do ensino fundamental",
        "6EF": "6º ano do ensino fundamental",
        "7EF": "7º ano do ensino fundamental",
        "8EF": "8º ano do ensino fundamental",
        "9EF": "9º ano do ensino fundamental",
        "1EM": "1º ano do ensino médio",
        "2EM": "2º ano do ensino médio",
        "3EM": "3º ano do ensino médio"
    } })
    })

  },    

  put(req, res) {
    const keys = Object.keys(req.body) //it will be an array of the keys of the object

    //* Checando se todos os campos estão preenchidos
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all the gaps")
      }
    }
    
    Student.update(req.body, () => {
      return res.redirect(`/students/${req.body.id}`)
    })
  }, 

  delete(req, res) {
    Student.delete(req.body.id, () => {
      return res.redirect(`/students`)
    }) 
  }
}