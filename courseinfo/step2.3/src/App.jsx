const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

const Course = (props) => {
  const course = props.course
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

const Content = (props) => {
  const parts = props.parts
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => {
    console.log('what is happening', sum, part)
    return sum + part.exercises
  }, 0)

  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

export default App
