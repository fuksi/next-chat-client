import React from 'react'
import './Group.scss'

class Group extends React.Component {
    render() {
        const myGoups = [
            { name: 'intro', selected: true },
            { name: 'next level' },
            { name: 'and the next' },
            { name: 'and another' },
        ]
        const otherGroups = [
            { name: 'intro' },
            { name: 'next level' },
            { name: 'and the next' },
            { name: 'and another' },
        ]
        return (
            <ul className="groups">
                <li>My groups
                    <ul>
                        {myGoups.map(g => <li className={g.selected ? 'selected' : ''}>
                            {g.name} {g.selected ? '(active)': ''}
                        </li>)}
                    </ul>
                </li>
                <li>Other groups
                    <ul>
                        {otherGroups.map(g => <li>{g.name}</li>)}
                    </ul>
                </li>
            </ul>
        )
    }
}

export default Group