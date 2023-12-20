import React, { useState } from 'react';
import Form from "./Form";
export default function MainPage() {
    const [answers, setAnswers] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState([null, null, null, null, null, null]);
    const [statuses, setStatuses] = useState(['typing', 'typing', 'typing', 'typing', 'typing', 'typing']);

    const questions = [
        'Какой порт локального хоста по умолчанию используется сервером разработки React?',
        'Какое ключевое слово создает константу в JavaScript?',
        'Какой оператор можно использовать для условного отображения компонента React?',
        'Имена компонентов React должны начинаться с заглавной буквы. (True/False)',
        'Копия "реального" DOM, которая хранится в памяти, называется',
        'При визуализации списка с использованием JavaScript метода map(), что требуется для каждого отображаемого элемента?'
    ];

    const correctAnswers = ['3000', 'const', '&&', 'True', 'Virtual DOM', 'key'];

    const handleSubmit = async (e, index) => {
        e.preventDefault();
        setStatuses((prevStatuses) => {
            const newStatuses = [...prevStatuses];
            newStatuses[index] = 'submitting'; //чтобы заблокировать возможность отправки формы повторно
            return newStatuses;
        });

        try {
            await submitForm(answers[index], correctAnswers[index]);
            setStatuses((prevStatuses) => { //если успешно
                const newStatuses = [...prevStatuses];
                newStatuses[index] = 'success';
                return newStatuses;
            });
            setErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = null; //тогда ошибка обнуляется
                return newErrors;
            });
        } catch (err) {
            setStatuses((prevStatuses) => {
                const newStatuses = [...prevStatuses];
                newStatuses[index] = 'typing';
                return newStatuses;
            });
            setErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = err;
                return newErrors;
            });
        }
    };

    const handleInputChange = (e, index) => { //обновляет состояние answers при изменении текста в поле ввода
        const newAnswers = [...answers];
        newAnswers[index] = e.target.value;
        setAnswers(newAnswers);
    };

    return (
        <>
            <Form />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Проверка знаний реакта</h2>
            {questions.map((question, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <p>{question}</p>
                    <form onSubmit={(e) => handleSubmit(e, index)}>
                        <textarea
                            value={answers[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            disabled={statuses[index] === 'submitting'}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <button disabled={answers[index].length === 0 || statuses[index] === 'submitting'} style={{ marginRight: '10px' }}>
                            Проверить
                        </button>
                        {statuses[index] === 'success' && <p style={{ color: 'green' }}>Правильно</p>}
                        {statuses[index] === 'typing' && errors[index] !== null && <p className="Error" style={{ color: 'red' }}>{errors[index].message}</p>}
                    </form>
                </div>
            ))}
        </>
    );
}

function submitForm(answer, correctAnswer) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let shouldError = answer.toLowerCase() !== correctAnswer.toLowerCase();
            if (shouldError) {
                reject(new Error('Не в этот раз, но получится!'));
            } else {
                resolve();
            }
        }, 1500);
    });
}
