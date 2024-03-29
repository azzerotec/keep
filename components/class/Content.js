import axios from 'axios';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { Input } from '@components/Input';
import {
    flexColumn,
    FlexColumn,
    FlexRow,
    FlexRowCentered,
    FlexRowReverse
} from '@components/styles/flex';
import { Card, CardHeader, CardFooter } from '@components/Card';
import { StudentList } from './StudentList';
import { Heading } from '@components/Title';
import { WeekDaySelect, pluralTranslation } from '@components/WeekDaySelect';
import { Button } from '@components/Button';
import CalendarVector from '../../public/icons/calendar.svg';
import ClockVector from '../../public/icons/clock.svg';
import { useStudentSidebarContext } from '@components/sidebars/StudentSidebar';
import { Dashboard } from 'service/routes';
import { ClassSchema } from 'serialize/class/ClassSchema';

const Column = styled(FlexColumn)`
    flex: 1 1 50%;
    margin: 0 18px;
`;

const StyledInput = styled(Input)`
    margin: 30px 0;
`;

const RowStretch = styled(FlexRow)`
    flex: 1 1 auto;
    margin: 30px 0;
`;

const ColumnStretch = styled(FlexColumn)`
    flex: 1 1 auto;
`;

const CardStretch = styled(Card)`
    padding 30px 26px;
    flex: 1 1 auto;
`;

const InputGroup = styled(FlexColumn)`
    margin: 0 12px;
    flex: 1 1 auto;
`;

const InputRow = styled(FlexRow)`
    margin: 0 -12px;
`;

const FooterTitle = styled.span`
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 150%;
    margin-bottom: 21px;
`;

const Description = styled(FlexRowCentered)`
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    margin: 2px;
`;

const iconBase = `
    width: 20px;
    margin-right: 12px;
`;

const CalendarIcon = styled(CalendarVector)`
    ${iconBase}
    padding: 3px;
`;

const ClockIcon = styled(ClockVector)`
    ${iconBase}
`;

const IconHolder = styled.div`
    ${iconBase}
`;

const StretchForm = styled(Form)`
    ${flexColumn}
    flex: 1 1 auto;
`;

export const Content = ({ studentList }) => {
    const router = useRouter();
    const { teacher, branch } = router.query;

    const [open, setOpen] = useStudentSidebarContext();
    const openCreateStudentSidebar = () => setOpen(true);

    const [selectedList, setSelectedList] = useState([]);
    const [week, setWeek] = useState([]);

    const initialValues = {
        name: '',
        category: '',
        initialDate: '',
        finalDate: '',
        initialTime: '',
        finalTime: ''
    };

    const handleSubmit = (
        { name, finalDate, initialDate, finalTime, initialTime, category },
        actions
    ) => {
        axios
            .post('/api/class', {
                name,
                teacher,
                endDate: `${finalDate}T${finalTime}:00`,
                startDate: `${initialDate}T${initialTime}:00`,
                categoryList: category ? category.split(',') : [],
                studentList: selectedList,
                week
            })
            .then(() => {
                router.push({
                    pathname: Dashboard.List.Class,
                    query: { branch }
                });
            })
            .catch(() => {
                actions.setSubmitting(false);
            });
    };

    return (
        <ColumnStretch>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={ClassSchema}
            >
                {({ values, isSubmitting, dirty, errors, touched }) => (
                    <StretchForm>
                        <RowStretch>
                            <Column>
                                <StyledInput
                                    name="name"
                                    placeholder="Nome da turma"
                                    error={errors.name}
                                    touched={touched.name}
                                />
                                <CardStretch footer>
                                    <InputRow>
                                        <InputGroup>
                                            <Heading>Data inicial</Heading>
                                            <Input
                                                name="initialDate"
                                                type="date"
                                                error={errors.initialDate}
                                                touched={touched.initialDate}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <Heading>Data final</Heading>
                                            <Input
                                                name="finalDate"
                                                type="date"
                                                error={errors.finalDate}
                                                touched={touched.finalDate}
                                            />
                                        </InputGroup>
                                    </InputRow>
                                    <InputRow>
                                        <InputGroup>
                                            <Heading>Horário inicial</Heading>
                                            <Input
                                                name="initialTime"
                                                type="time"
                                                error={errors.initialTime}
                                                touched={touched.initialTime}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <Heading>Horário final</Heading>
                                            <Input
                                                name="finalTime"
                                                type="time"
                                                error={errors.finalTime}
                                                touched={touched.finalTime}
                                            />
                                        </InputGroup>
                                    </InputRow>
                                    <FlexColumn>
                                        <Heading>
                                            Selecione os dias em que a aula
                                            acontecerá:
                                        </Heading>
                                        <WeekDaySelect
                                            onChange={setWeek}
                                            value={week}
                                        />
                                    </FlexColumn>
                                </CardStretch>
                                <CardFooter>
                                    <FooterTitle>Dados da Turma</FooterTitle>
                                    <Description>
                                        {values.initialDate && (
                                            <>
                                                <CalendarIcon />
                                                {`${new Date(
                                                    values.initialDate
                                                ).toLocaleDateString()} à ${new Date(
                                                    values.finalDate
                                                ).toLocaleDateString()}`}
                                            </>
                                        )}
                                    </Description>
                                    <Description>
                                        <IconHolder />
                                        {week.map((weekday, index) => {
                                            const label =
                                                pluralTranslation[weekday];
                                            if (
                                                index === week.length - 1 &&
                                                index !== 0
                                            )
                                                return ` e ${label}`;
                                            if (index > 0) return `, ${label}`;
                                            return label;
                                        })}
                                    </Description>
                                    <Description>
                                        {values.initialTime && (
                                            <>
                                                <ClockIcon />
                                                {`${values.initialTime} às ${values.finalTime}`}
                                            </>
                                        )}
                                    </Description>
                                </CardFooter>
                            </Column>
                            <Column>
                                <StyledInput
                                    name="category"
                                    placeholder="Categoria"
                                    error={errors.category}
                                    touched={touched.category}
                                />
                                <CardStretch>
                                    <CardHeader
                                        onAddClick={openCreateStudentSidebar}
                                        total={studentList.length}
                                        title="Alunos"
                                    />
                                    <StudentList
                                        data={studentList}
                                        selectedList={selectedList}
                                        onSelect={setSelectedList}
                                    />
                                </CardStretch>
                            </Column>
                        </RowStretch>
                        <FlexRowReverse>
                            <Button
                                disabled={isSubmitting || !dirty}
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </FlexRowReverse>
                    </StretchForm>
                )}
            </Formik>
        </ColumnStretch>
    );
};
