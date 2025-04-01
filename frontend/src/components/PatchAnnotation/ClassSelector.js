import React from 'react';

const ClassSelector = ({ classes, selectedClass, onSelectClass }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {classes.map((classItem) => (
        <button
          key={classItem.id}
          className={`p-2 rounded ${
            selectedClass === classItem.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onSelectClass(classItem.id)}
        >
          <div className="flex items-center">
            <span className="mr-1">{classItem.id}.</span>
            <span>{classItem.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ClassSelector;