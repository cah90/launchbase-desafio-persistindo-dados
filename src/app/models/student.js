const db = require("../../config/db")
const { age, date, grade} = require('../lib/utils')
const Intl = require("intl")

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM students ORDER BY name ASC`, (err, results) => {
      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
    const query = `
    INSERT INTO students (
      avatar_url,
      name,
      email,
      birth,
      school_year,
      total_hours,
      created_at,
      teacher_id
    ) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.school_year,
      data.total_hours,
      date(Date.now()).iso,
      data.teacher
    ]

    db.query(query, values, (err,results) => {
      if(err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },

  find(id, callback) {
    console.log(`ID is: ${id}`)    

    db.query(`
    SELECT students.*, teachers.name AS teacher_name
    FROM students 
    LEFT JOIN teachers ON (students.teacher_id = teachers.id)
    WHERE students.id=$1`, [id], (err, results) => {
      if(err) throw `Database error! ${err}`

      callback(results.rows[0])

    }) 
  },

  update(data, callback) {
    console.log(data)

    const query = `
    UPDATE students SET
      avatar_url=($1),
      name=($2),
      email=($3),
      birth=($4),
      school_year=($5),
      total_hours=($6),
      teacher_id=($7)
    WHERE id= $8
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.school_year,
      data.total_hours,
      data.teacher,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database error! ${err}`

      callback()
    })
  },

  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = $1`, [id], (err, results) => {
      if(err) throw `Database error! ${err}`

      return callback()
    })
  },

  teachersSelectedOptions(callback) {
    db.query(`SELECT name, id FROM teachers`, (err, results) => {
      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })
  }
}